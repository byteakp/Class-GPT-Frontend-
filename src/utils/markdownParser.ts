export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Slide {
  id: string;
  title: string;
  content: string[];
}

export interface NotesSection {
  id: string;
  title: string;
  content: string;
  subsections?: NotesSection[];
}

export const parseMCQs = (content: string): MCQ[] => {
  console.log('Raw MCQ content:', content);
  
  // Split by multiple separators and filter empty blocks
  const questionBlocks = content.split(/---+|\n\n(?=##)|\n\n(?=\*\*Question)|\n\n(?=\d+\.)/g).filter(block => 
    block.trim() && (block.includes('Question') || block.includes('**Question') || block.match(/^\d+\./) || block.includes('?'))
  );
  
  console.log('Question blocks:', questionBlocks);
  
  return questionBlocks.map((questionBlock, index) => {
    const lines = questionBlock.trim().split('\n').filter(line => line.trim());
    
    let question = '';
    const options: string[] = [];
    let correctAnswer = '';
    let explanation = '';
    
    let currentSection = 'question';
    let foundQuestion = false;
    
    // First pass: extract the actual question content
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip headers and look for actual question content
      if (line.startsWith('#') || line.toLowerCase().includes('question') && line.includes(':')) {
        continue;
      }
      
      // Look for question text - it's usually the first substantial line that's not a header
      if (!foundQuestion && line.length > 10 && !line.match(/^[A-D]\)/) && !line.toLowerCase().includes('answer') && !line.toLowerCase().includes('explanation')) {
        // Clean up any markdown formatting
        question = line.replace(/\*\*/g, '').replace(/^\d+\.\s*/, '').trim();
        foundQuestion = true;
        continue;
      }
      
      // Extract options
      if (line.match(/^[A-D]\)/)) {
        options.push(line);
        continue;
      }
      
      // Extract correct answer
      if (line.toLowerCase().includes('correct answer') || line.toLowerCase().includes('answer:')) {
        correctAnswer = line
          .replace(/\*\*Correct Answer:\*\*|\*\*Correct Answer\*\*|Correct Answer:?|Answer:/gi, '')
          .trim();
        continue;
      }
      
      // Extract explanation
      if (line.toLowerCase().includes('explanation')) {
        explanation = line
          .replace(/\*\*Explanation:\*\*|\*\*Explanation\*\*|Explanation:?/gi, '')
          .trim();
        // Continue reading explanation on next lines
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j].trim();
          if (nextLine && !nextLine.toLowerCase().includes('question') && !nextLine.match(/^[A-D]\)/)) {
            explanation += ' ' + nextLine.replace(/\*\*/g, '');
          } else {
            break;
          }
        }
        break;
      }
    }
    
    // Fallback: if no proper question found, look for any substantial text
    if (!foundQuestion || question.length < 5) {
      for (const line of lines) {
        const cleanLine = line.trim().replace(/\*\*/g, '').replace(/^#+\s*/, '').replace(/^\d+\.\s*/, '');
        if (cleanLine.length > 15 && !cleanLine.match(/^[A-D]\)/) && !cleanLine.toLowerCase().includes('answer') && !cleanLine.toLowerCase().includes('explanation')) {
          question = cleanLine;
          break;
        }
      }
    }
    
    // Ensure we have a valid question
    if (!question || question.length < 5) {
      question = `What is the main concept being tested in this question?`;
    }
    
    // Ensure we have options
    if (options.length === 0) {
      options.push('A) Option A', 'B) Option B', 'C) Option C', 'D) Option D');
    }
    
    // Ensure we have a correct answer
    if (!correctAnswer) {
      correctAnswer = 'A';
    }
    
    // Clean up the correct answer to just the letter
    if (correctAnswer.includes(')')) {
      const match = correctAnswer.match(/[A-D]\)/);
      correctAnswer = match ? match[0].charAt(0) : 'A';
    } else if (correctAnswer.length > 1) {
      const match = correctAnswer.match(/[A-D]/);
      correctAnswer = match ? match[0] : 'A';
    }
    
    const mcq = {
      id: `mcq-${index}`,
      question: question.trim(),
      options: options,
      correctAnswer: correctAnswer,
      explanation: explanation || 'No explanation provided.'
    };
    
    console.log(`Parsed MCQ ${index + 1}:`, mcq);
    return mcq;
  }).filter(mcq => mcq.question && mcq.question.length > 5);
};

export const parseSlides = (content: string): Slide[] => {
  // Split by --- or ## headers
  const slideBlocks = content.split(/---+|(?=^##\s)/gm).filter(block => block.trim());
  
  return slideBlocks.map((block, index) => {
    const lines = block.trim().split('\n').filter(line => line.trim());
    
    let title = `Slide ${index + 1}`;
    const contentLines: string[] = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Extract title from ## headers
      if (trimmedLine.startsWith('##')) {
        title = trimmedLine.replace(/^#+\s*/, '').replace(/\*\*/g, '');
      }
      // Extract bullet points
      else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || trimmedLine.startsWith('•')) {
        contentLines.push(trimmedLine.replace(/^[-*•]\s*/, '').replace(/\*\*/g, ''));
      }
      // Add other content lines
      else if (trimmedLine && !trimmedLine.startsWith('#')) {
        contentLines.push(trimmedLine.replace(/\*\*/g, ''));
      }
    }
    
    return {
      id: `slide-${index}`,
      title,
      content: contentLines.length > 0 ? contentLines : [`Content for ${title}`]
    };
  }).filter(slide => slide.content.length > 0);
};

export const parseNotes = (content: string): NotesSection[] => {
  const lines = content.split('\n');
  const sections: NotesSection[] = [];
  let currentSection: NotesSection | null = null;
  let currentSubsection: NotesSection | null = null;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Main section (##)
    if (trimmedLine.startsWith('## ')) {
      // Save previous section
      if (currentSection) {
        if (currentSubsection) {
          currentSection.subsections!.push(currentSubsection);
        }
        sections.push(currentSection);
      }
      
      currentSection = {
        id: `section-${sections.length}`,
        title: trimmedLine.replace('## ', '').replace(/\*\*/g, ''),
        content: '',
        subsections: []
      };
      currentSubsection = null;
    }
    // Subsection (###)
    else if (trimmedLine.startsWith('### ')) {
      if (currentSection) {
        if (currentSubsection) {
          currentSection.subsections!.push(currentSubsection);
        }
        currentSubsection = {
          id: `subsection-${currentSection.subsections!.length}`,
          title: trimmedLine.replace('### ', '').replace(/\*\*/g, ''),
          content: ''
        };
      }
    }
    // Content lines
    else if (trimmedLine && !trimmedLine.startsWith('#')) {
      const cleanLine = trimmedLine.replace(/\*\*/g, '');
      if (currentSubsection) {
        currentSubsection.content += (currentSubsection.content ? '\n' : '') + cleanLine;
      } else if (currentSection) {
        currentSection.content += (currentSection.content ? '\n' : '') + cleanLine;
      }
    }
  }
  
  // Add the last subsection and section
  if (currentSubsection && currentSection) {
    currentSection.subsections!.push(currentSubsection);
  }
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return sections.filter(section => section.title && (section.content || section.subsections!.length > 0));
};

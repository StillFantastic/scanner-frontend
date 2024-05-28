'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { FilesContent } from '@/types';

interface ReviewContextType {
  context: string;
  filesContent: FilesContent;
  issues: any[];
  setContext: (context: string) => void;
  setFilesContent: (filesContent: FilesContent) => void;
  setIssues: (issues: any[]) => void;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider = ({ children }: { children: ReactNode }) => {
  const [context, setContext] = useState<string>('');
  const [filesContent, setFilesContent] = useState<{ [key: string]: string }>(
    {},
  );
  const [issues, setIssues] = useState<any[]>([]);

  return (
    <ReviewContext.Provider
      value={{
        context,
        filesContent,
        issues,
        setContext,
        setFilesContent,
        setIssues,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = (): ReviewContextType => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReview must be used within a ReviewProvider');
  }
  return context;
};

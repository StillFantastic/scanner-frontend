'use client';

import { useEffect, useState } from 'react';
import IssueList from '../../components/IssueList';
import CodeEditor from '../../components/CodeEditor';
import { useReview } from '@/contexts/ReviewContext';
import { Issue } from '@/types';

const ReviewResults = () => {
  const { filesContent, issues } = useReview();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    if (Object.keys(filesContent).length > 0) {
      setSelectedFile(Object.keys(filesContent)[0]);
    }
  }, [filesContent]);

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setSelectedFile(issue.filename);
  };

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="container mx-auto p-4 flex flex-1">
        <div className="w-1/3 p-4 flex flex-col border border-gray-300 dark:border-gray-600 rounded-md">
          {issues.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-gray-400">
              <p>No issues found. Your code looks great!</p>
            </div>
          ) : (
            <IssueList issues={issues} onIssueClick={handleIssueClick} />
          )}
        </div>
        <div className="w-2/3 pt-4 flex flex-col border border-gray-300 dark:border-gray-600 rounded-md">
          {
            <CodeEditor
              code={
                selectedIssue
                  ? filesContent[selectedIssue.filename]
                  : issues.length
                    ? filesContent[issues[0].filename]
                    : ''
              }
              // FIXME
              language="javascript"
              options={{
                validate: false,
                readOnly: true,
                lineNumbers: 'on',
              }}
              highlightRange={
                selectedIssue
                  ? {
                    startLine: parseInt(
                      selectedIssue.line_range.split('-')[0],
                      10,
                    ),
                    endLine: parseInt(
                      selectedIssue.line_range.split('-')[1],
                      10,
                    ),
                  }
                  : undefined
              }
            />
          }
        </div>
      </div>
    </div>
  );
};

export default ReviewResults;

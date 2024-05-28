'use client';
import { useState } from 'react';
import {
  CollapsibleTrigger,
  CollapsibleContent,
  Collapsible,
} from '@/components/ui/collapsible';
import { Issue } from '@/types';

interface IssueListProps {
  issues: Issue[];
  onIssueClick: (issue: Issue) => void;
}

const IssueList: React.FC<IssueListProps> = ({ issues, onIssueClick }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleTriggerClick = (index: number, issue: Issue) => {
    setActiveIndex(index === activeIndex ? null : index); // 切换激活的折叠项
    onIssueClick(issue);
  };

  // FIXME animation
  return (
    <div className="flex-1 overflow-auto space-y-2">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center">
        Security Issues
      </h2>
      <hr className="border-gray-600 dark:border-gray-600 my-2" />
      <div className="border border-gray-300 dark:border-gray-600 rounded p-2">
        {issues.map((issue, index) => (
          <Collapsible
            key={index}
            className="space-y-1"
            open={activeIndex === index}
          >
            <CollapsibleTrigger
              className="flex items-center justify-between w-full rounded px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => handleTriggerClick(index, issue)}
            >
              <div className="flex items-center space-x-2">
                <TriangleAlertIcon className="w-4 h-4 text-red-500" />
                <h3 className="text-m font-semibold text-gray-800 dark:text-gray-200">
                  {issue.issue_title}
                </h3>
              </div>
              {index == activeIndex ? (
                <ChevronUpIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent
              className={`rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 collapsible-content ${activeIndex === index ? 'expand' : 'collapse'}`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  {issue.filename}
                </span>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {issue.line_range}
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {issue.issue_description}
              </span>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default IssueList;

function ChevronDownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 15 6-6 6 6" />
    </svg>
  );
}

function TriangleAlertIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import LoginDialog from '@/components/LoginDialog';
import { useReview } from '@/contexts/ReviewContext';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircleIcon, UploadIcon } from '@heroicons/react/solid';

export default function UploadForm() {
  const [context, setContext] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const {
    setContext: setGlobalContext,
    setFilesContent,
    setIssues,
  } = useReview();
  const { isAuthenticated, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [filesSelected, setFilesSelected] = useState(false);
  const [folderSelected, setFolderSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 禁用滚动
    document.body.style.overflow = 'hidden';

    // 在组件卸载时重新启用滚动
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
      if (fileInputRef.current?.getAttribute('webkitdirectory')) {
        setFolderSelected(true);
        setFilesSelected(false);
      } else {
        setFolderSelected(false);
        setFilesSelected(true);
      }
    }
  };

  const handleUploadClick = (isFolder: boolean) => {
    if (fileInputRef.current) {
      if (isFolder) {
        fileInputRef.current.setAttribute('webkitdirectory', 'true');
      } else {
        fileInputRef.current.removeAttribute('webkitdirectory');
      }
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }

    if (files) {
      const formData = new FormData();
      formData.append('context', context);
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });

      const token = localStorage.getItem('token');

      try {
        setIsLoading(true);

        // TODO: use env
        const response = await axios.post(
          'http://localhost:8081/api/review/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const issues = response.data.result;
        const filesContent: { [key: string]: string } = {};
        Array.from(files).forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target) {
              filesContent[file.name] = e.target.result as string;
            }
          };
          reader.readAsText(file);
        });

        setTimeout(() => {
          setGlobalContext(context);
          setFilesContent(filesContent);
          setIssues(issues);
          router.push('/review-results');
        }, 1000);
      } catch (error) {
        setIsLoading(false);
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status == 401) {
            logout();
            setShowLogin(true);
          } else {
            console.error(
              'Error uploading files:',
              error.response?.data || error.message,
            );
          }
        } else {
          console.error('Error uploading files:', error);
        }
      }
    }
  };

  return (
    <div
      key="1"
      className="flex flex-col items-center min-h-screen bg-white p-6 mt-24"
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      ) : (
        <>
          <div className="text-center">
            <h1 className="text-5xl font-bold leading-tight">
              Generate. Refine. Ship.
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Generate review reports from simple text prompts and files.
            </p>
          </div>
          <div className="mt-10">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => handleUploadClick(false)}
              >
                {filesSelected ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                    Files Selected
                  </>
                ) : (
                  <>
                    <UploadIcon className="w-5 h-5 text-blue-500 mr-2" />
                    Upload Files
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => handleUploadClick(true)}>
                {folderSelected ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                    Folder Selected
                  </>
                ) : (
                  <>
                    <UploadIcon className="w-5 h-5 text-blue-500 mr-2" />
                    Upload Folder
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="mt-12 relative w-full max-w-lg">
            <Textarea
              className="h-40 flex-1 rounded-l-md text-white bg-black"
              id="context"
              placeholder="This is project context."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>
          <div className="mt-12">
            <Button
              className="relative h-12 w-48 rounded-md bg-black text-white"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
          <LoginDialog isOpen={showLogin} onClose={() => setShowLogin(false)} />
        </>
      )}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

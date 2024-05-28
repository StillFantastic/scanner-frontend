export interface Issue {
  filename: string;
  line_range: string;
  issue_title: string;
  issue_description: string;
}

export interface FilesContent {
  [key: string]: string;
}

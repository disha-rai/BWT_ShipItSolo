export type Snapshot = {
  id: string;
  timestamp: string;
  code: string;
  note: string;
};

export type Session = {
  id: string;
  startedAt: string;
  name?: string;
};

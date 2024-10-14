export interface RealtimeEvent {
    time: string;
    source: 'client' | 'server';
    count?: number;
    event: { [key: string]: any };
  }
  
  export type Difficulty = 'Easy' | 'Medium' | 'Hard';
  
  export type Scenario = 'Repeated Deadline Misses' | 'Resistance to Feedback' | 'Negative Attitude in Meetings' | "Disrespecting Colleagues' Ideas" | 'Frequent Absences Affecting Work';
  
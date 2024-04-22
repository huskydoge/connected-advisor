export interface Advisor {
  advisor_id: string;
  name: string;
  affiliation: string;
  website: string;
  twitter: string;
  github: string;
  email: string;
  position: string;
  connections: {
    advisor_id: string;

    relation: Array<{
      class: string;
      role: string;
      duration: {
        start: number;
        end: number;
      };
    }>;
    collaborations: Array<{
      papername: string;
      year: number;
      url: string;
    }>;
    latestCollaboration: number;
    relationFactor: number;
  }[];
}

export interface AdvisorDetails {
  advisor_id: string;
  name: string;
  position: string;
  affiliation: string;
  avatar: string;
  github: string;
  homepage: string;
  description: string;
  tags: string[];
  connections: any[];
  contacts: {
    twitter: string;
    email: string;
    linkin: string;
  };
  }
}

export interface Connection {
  advisor_id: string;
  relation: Array<{
    class: string;
    role: string;
    duration: {
      start: number;
      end: number;
    };
  }>;
  collaborations: Array<{
    papername: string;
    year: number;
    url: string;
  }>;
  latestCollaboration: number;
  relationFactor: number;
}

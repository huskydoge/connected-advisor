// export interface Advisor {
//   _id: string;
//   name: string;
//   affiliation: string;
//   homepage: string;
//   twitter: string;
//   github: string;
//   email: string;
//   position: string;
//   connections: {
//     _id: string;

//     relation: Array<{
//       type: string;
//       role: string;
//       duration: {
//         start: number;
//         end: number;
//       };
//     }>;
//     collaborations: Array<{
//       papername: string;
//       year: number;
//       url: string;
//     }>;
//     latestCollaboration: number;
//     relationFactor: number;
//   }[];
// }

export interface Advisor {
  name: string;
  _id: string;
  position: string;
  affiliation: string;
  department: string;
  picture: string;
  github?: string;
  twitter?: string;
  email: string;
  homepage?: string;
  description?: string;
  tags?: string[];
  connections?: any[];
}

export interface Config {
  graphDegree: number;
  colorPattern: string;
  graphType: string;
  showAvatars: boolean;
}

export interface AdvisorDetails {
  _id: string;
  name: string;
  position: string;
  department: string;
  affiliation: string;
  picture: string;
  github: string;
  homepage: string;
  description: string;
  tags: string[];
  connections: Connection[];
  contacts: {
    twitter: string;
    email: string;
    linkedin: string;
  };
}

export interface Connection {
  _id: string;
  relations: Array<{
    type: string;
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
}

export interface Relation {
  type: string;
  "role-1": string;
  "role-2": string;
  "id-1": string;
  "id-2": string;
  duration: {
    start: number;
    end: number;
  };
}

export interface Paper {
  _id: string;
  name: string;
  year: number;
  url: string;
  abstract: string;
  authors: string[];
}

export interface StatisticsData {
  affiliationCounts: object;
  positionCounts: object;
  tagCounts: object;
}

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
//       class: string;
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
  avatar: string;
  github?: string;
  twitter?: string;
  email: string;
  homepage?: string;
  description?: string;
  tags?: string[];
  connections?: any[];
}

export interface AdvisorDetails {
  _id: string;
  name: string;
  position: string;
  department: string;
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
    linkedin: string;
  };
}

export interface Connection {
  _id: string;
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

export interface Relation {
  class: string;
  role: string;
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

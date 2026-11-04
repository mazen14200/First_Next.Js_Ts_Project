export type Project = {
  id: number;
  nameAr: string;
  nameEn: string;
  serialCode: string;
  managerName: string | null;
  statusName: string
  startDate: string;
  endDate: string;
};

export type Column = {
  id: number;
  name: string;
  colorCode: string | null;
  projects: Project[];
};

export type Columns = Column[];
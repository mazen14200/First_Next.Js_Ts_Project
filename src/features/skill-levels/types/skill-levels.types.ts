export interface SkillLevel {
  id: number;
  nameAr: string;
  nameEn: string;
  rank: number;
}

export interface CreateSkillLevelRequest {
  nameAr: string;
  nameEn: string;
  rank: number;
}

export interface UpdateSkillLevelRequest {
  nameAr: string;
  nameEn: string;
  rank: number;
}

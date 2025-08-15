function transformWorkExperiences(workExperiences: string | any[]): any[] {
  const experiences =
    typeof workExperiences === "string"
      ? JSON.parse(workExperiences)
      : workExperiences;

  const monthMap: Record<string, number> = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };

  return experiences.map((exp: any) => ({
    ...exp,
    startMonth: monthMap[exp.startMonth] || null,
    endMonth: monthMap[exp.endMonth] || null,
  }));
}

export default transformWorkExperiences;

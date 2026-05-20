import { MasterProfile, ResumeOverrides } from "../../../shared/types";

export interface MergedProfile {
  personalInfo: MasterProfile["personalInfo"];
  experiences: MasterProfile["experiences"];
  education: MasterProfile["education"];
  skills: MasterProfile["skills"];
  projects: MasterProfile["projects"];
  certifications: MasterProfile["certifications"];
  customSections: MasterProfile["customSections"];
}

/**
 * Deep merges Master Profile data with local resume overrides,
 * filtering hidden items and ordering items based on override configurations.
 */
export const mergeProfileWithOverrides = (
  profile: MasterProfile | null,
  overrides: ResumeOverrides | null | undefined
): MergedProfile => {
  // Default fallback if profile is empty
  const defaultProfile: MergedProfile = {
    personalInfo: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      github: "",
      linkedin: "",
      summary: "",
    },
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    customSections: [],
  };

  if (!profile) return defaultProfile;

  const ov = overrides || {};

  // 1. Merge Personal Info
  const personalInfo = {
    ...profile.personalInfo,
    ...(ov.personalInfo || {}),
  };

  // 2. Merge Experiences
  const experiences = (profile.experiences || [])
    .filter((exp) => {
      const expOverride = ov.experiences?.[exp.id];
      return expOverride?.hidden !== true;
    })
    .map((exp) => {
      const expOverride = ov.experiences?.[exp.id];
      return {
        ...exp,
        position: expOverride?.position || exp.position,
        highlights: expOverride?.highlights || exp.highlights,
        customOrder: expOverride?.customOrder ?? 999,
      };
    })
    .sort((a, b) => a.customOrder - b.customOrder);

  // Remove the temporary customOrder before returning
  const cleanedExperiences = experiences.map(({ customOrder, ...rest }) => rest);

  // 3. Merge Education
  const education = (profile.education || [])
    .filter((edu) => {
      const eduOverride = ov.education?.[edu.id];
      return eduOverride?.hidden !== true;
    })
    .map((edu) => {
      const eduOverride = ov.education?.[edu.id];
      return {
        ...edu,
        details: eduOverride?.details || edu.details,
        customOrder: eduOverride?.customOrder ?? 999,
      };
    })
    .sort((a, b) => a.customOrder - b.customOrder);

  const cleanedEducation = education.map(({ customOrder, ...rest }) => rest);

  // 4. Merge Projects
  const projects = (profile.projects || [])
    .filter((proj) => {
      const projOverride = ov.projects?.[proj.id];
      return projOverride?.hidden !== true;
    })
    .map((proj) => {
      const projOverride = ov.projects?.[proj.id];
      return {
        ...proj,
        description: projOverride?.description || proj.description,
        highlights: projOverride?.highlights || proj.highlights,
        customOrder: projOverride?.customOrder ?? 999,
      };
    })
    .sort((a, b) => a.customOrder - b.customOrder);

  const cleanedProjects = projects.map(({ customOrder, ...rest }) => rest);

  // 5. Merge Skills
  const skills = (profile.skills || [])
    .filter((skill) => {
      const skillOverride = ov.skills?.[skill.id];
      return skillOverride?.hidden !== true;
    })
    .map((skill) => {
      const skillOverride = ov.skills?.[skill.id];
      return {
        ...skill,
        customOrder: skillOverride?.customOrder ?? 999,
      };
    })
    .sort((a, b) => a.customOrder - b.customOrder);

  const cleanedSkills = skills.map(({ customOrder, ...rest }) => rest);

  // 6. Merge Certifications
  const certifications = (profile.certifications || [])
    .filter((cert) => {
      const certOverride = ov.certifications?.[cert.id];
      return certOverride?.hidden !== true;
    })
    .map((cert) => {
      const certOverride = ov.certifications?.[cert.id];
      return {
        ...cert,
        customOrder: certOverride?.customOrder ?? 999,
      };
    })
    .sort((a, b) => a.customOrder - b.customOrder);

  const cleanedCertifications = certifications.map(({ customOrder, ...rest }) => rest);

  // 7. Merge Custom Sections
  const customSections = (profile.customSections || [])
    .filter((section) => {
      const secOverride = ov.customSections?.[section.id];
      return secOverride?.hidden !== true;
    })
    .map((section) => {
      const secOverride = ov.customSections?.[section.id];
      const items = (section.items || [])
        .filter((item) => {
          const itemOverride = secOverride?.items?.[item.id];
          return itemOverride?.hidden !== true;
        })
        .map((item) => {
          const itemOverride = secOverride?.items?.[item.id];
          return {
            ...item,
            highlights: itemOverride?.highlights || item.highlights,
          };
        });

      return {
        ...section,
        name: secOverride?.name || section.name,
        items,
        customOrder: secOverride?.customOrder ?? 999,
      };
    })
    .sort((a, b) => a.customOrder - b.customOrder);

  const cleanedCustomSections = customSections.map(({ customOrder, ...rest }) => rest);

  return {
    personalInfo,
    experiences: cleanedExperiences,
    education: cleanedEducation,
    skills: cleanedSkills,
    projects: cleanedProjects,
    certifications: cleanedCertifications,
    customSections: cleanedCustomSections,
  };
};

import React from "react";
import { 
  Document, 
  Page, 
  Text, 
  View, 
  Link, 
  StyleSheet
} from "@react-pdf/renderer";
import { MergedProfile } from "../utils/merge";

// Standard core fonts like 'Times-Roman', 'Helvetica', 'Helvetica-Bold', 'Helvetica-Oblique', 'Times-Bold' do not require external font registration.

interface PdfDocumentProps {
  mergedData: MergedProfile;
  templateId: string;
}

export const PdfDocument: React.FC<PdfDocumentProps> = ({ mergedData, templateId }) => {
  const { personalInfo, experiences, education, skills, projects, certifications } = mergedData;

  // Determine styling based on selected template
  const isSerif = templateId === "classic-ats" || templateId === "executive";
  const primaryColor = 
    templateId === "creative-clean" ? "#7c3aed" : 
    templateId === "executive" ? "#1e3a8a" : "#111827";

  const styles = StyleSheet.create({
    page: {
      padding: 36, // ~0.5in
      backgroundColor: "#ffffff",
      fontFamily: isSerif ? "Times-Roman" : "Helvetica",
      fontSize: 9.5,
      color: "#1f2937",
      lineHeight: 1.25,
    },
    // Header
    headerContainer: {
      borderBottomWidth: templateId === "executive" ? 2 : 1,
      borderBottomColor: primaryColor,
      borderBottomStyle: "solid",
      paddingBottom: 6,
      marginBottom: 10,
      textAlign: "center",
    },
    fullName: {
      fontSize: 16,
      fontFamily: isSerif ? "Times-Bold" : "Helvetica-Bold",
      color: primaryColor,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 3,
    },
    title: {
      fontSize: 10.5,
      fontFamily: isSerif ? "Times-Bold" : "Helvetica-Bold",
      color: "#4b5563",
      marginBottom: 4,
    },
    contactRow: {
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: 8,
      fontSize: 8.5,
      color: "#4b5563",
    },
    contactItem: {
      color: "#4b5563",
      textDecoration: "none",
    },
    contactDivider: {
      color: "#9ca3af",
    },

    // Sections
    sectionContainer: {
      marginTop: 8,
      marginBottom: 4,
    },
    sectionTitle: {
      fontSize: 10.5,
      fontFamily: isSerif ? "Times-Bold" : "Helvetica-Bold",
      color: primaryColor,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      borderBottomWidth: templateId === "classic-ats" ? 0.5 : 1,
      borderBottomColor: "#cbd5e1",
      borderBottomStyle: "solid",
      paddingBottom: 2,
      marginBottom: 5,
    },

    // Summary
    summaryText: {
      fontSize: 9,
      lineHeight: 1.3,
      textAlign: "justify",
    },

    // Experience & Projects
    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      fontWeight: "bold",
      fontSize: 9.5,
      marginBottom: 2,
    },
    companyName: {
      fontFamily: isSerif ? "Times-Bold" : "Helvetica-Bold",
      color: "#111827",
    },
    itemDates: {
      fontSize: 8.5,
      color: "#4b5563",
      fontFamily: isSerif ? "Times-Bold" : "Helvetica-Bold",
    },
    itemSubheader: {
      flexDirection: "row",
      justifyContent: "space-between",
      fontSize: 9,
      fontStyle: "italic",
      marginBottom: 3,
    },
    itemTitle: {
      fontFamily: isSerif ? "Times-Italic" : "Helvetica-Oblique",
      color: "#374151",
    },
    itemLocation: {
      fontSize: 8.5,
      color: "#6b7280",
    },
    bulletList: {
      marginLeft: 12,
      marginTop: 2,
    },
    bulletItem: {
      flexDirection: "row",
      marginBottom: 2.5,
    },
    bulletDot: {
      width: 8,
      fontSize: 8,
    },
    bulletText: {
      flex: 1,
      fontSize: 8.5,
      lineHeight: 1.25,
      textAlign: "justify",
    },

    // Skills Matrix
    skillsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 5,
      marginTop: 2,
    },
    skillBadge: {
      fontSize: 8.5,
      paddingHorizontal: 5,
      paddingVertical: 1.5,
      backgroundColor: "#f3f4f6",
      borderRadius: 3,
      borderWidth: 0.5,
      borderColor: "#e5e7eb",
    },
    skillName: {
      fontFamily: isSerif ? "Times-Bold" : "Helvetica-Bold",
      color: "#374151",
    },
  });

  return (
    <Document title={`${personalInfo.fullName} - Resume`}>
      <Page size="LETTER" style={styles.page}>
        
        {/* Contact Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.fullName}>{personalInfo.fullName || "Your Name"}</Text>
          {personalInfo.title ? <Text style={styles.title}>{personalInfo.title}</Text> : null}
          
          <View style={styles.contactRow}>
            {personalInfo.email ? (
              <Text style={styles.contactItem}>{personalInfo.email}</Text>
            ) : null}
            {personalInfo.phone ? (
              <>
                <Text style={styles.contactDivider}>•</Text>
                <Text style={styles.contactItem}>{personalInfo.phone}</Text>
              </>
            ) : null}
            {personalInfo.location ? (
              <>
                <Text style={styles.contactDivider}>•</Text>
                <Text style={styles.contactItem}>{personalInfo.location}</Text>
              </>
            ) : null}
            {personalInfo.website ? (
              <>
                <Text style={styles.contactDivider}>•</Text>
                <Link src={personalInfo.website} style={styles.contactItem}>Portfolio</Link>
              </>
            ) : null}
            {personalInfo.github ? (
              <>
                <Text style={styles.contactDivider}>•</Text>
                <Link src={personalInfo.github} style={styles.contactItem}>GitHub</Link>
              </>
            ) : null}
            {personalInfo.linkedin ? (
              <>
                <Text style={styles.contactDivider}>•</Text>
                <Link src={personalInfo.linkedin} style={styles.contactItem}>LinkedIn</Link>
              </>
            ) : null}
          </View>
        </View>

        {/* 1. Professional Summary */}
        {personalInfo.summary ? (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{personalInfo.summary}</Text>
          </View>
        ) : null}

        {/* 2. Professional Experience */}
        {experiences.length > 0 ? (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {experiences.map((exp, idx) => (
              <View key={exp.id || idx} style={{ marginBottom: 6 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.companyName}>{exp.company}</Text>
                  <Text style={styles.itemDates}>{exp.startDate} – {exp.endDate}</Text>
                </View>
                <View style={styles.itemSubheader}>
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                  {exp.location ? <Text style={styles.itemLocation}>{exp.location}</Text> : null}
                </View>
                
                {exp.highlights.length > 0 ? (
                  <View style={styles.bulletList}>
                    {exp.highlights.map((h, i) => (
                      <View key={i} style={styles.bulletItem}>
                        <Text style={styles.bulletDot}>•</Text>
                        <Text style={styles.bulletText}>{h}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* 3. Projects */}
        {projects.length > 0 ? (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Key Projects</Text>
            {projects.map((proj, idx) => (
              <View key={proj.id || idx} style={{ marginBottom: 6 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.companyName}>{proj.name}</Text>
                  {proj.github || proj.url ? (
                    <Link src={proj.github || proj.url} style={styles.itemDates}>Project Link</Link>
                  ) : null}
                </View>
                <Text style={{ fontSize: 8.5, color: "#4b5563", marginBottom: 2 }}>
                  {proj.description}
                </Text>
                {proj.technologies.length > 0 ? (
                  <Text style={{ fontSize: 8, color: primaryColor, fontStyle: "italic" }}>
                    Technologies: {proj.technologies.join(", ")}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* 4. Education */}
        {education.length > 0 ? (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, idx) => (
              <View key={edu.id || idx} style={{ marginBottom: 4 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.companyName}>{edu.institution}</Text>
                  <Text style={styles.itemDates}>{edu.startDate} – {edu.endDate}</Text>
                </View>
                <View style={styles.itemSubheader}>
                  <Text style={styles.itemTitle}>{edu.degree} in {edu.fieldOfStudy} {edu.gpa ? `(GPA: ${edu.gpa})` : ""}</Text>
                  {edu.location ? <Text style={styles.itemLocation}>{edu.location}</Text> : null}
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {/* 5. Skills */}
        {skills.length > 0 ? (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Core Skills</Text>
            <View style={styles.skillsContainer}>
              {skills.map((skill, idx) => (
                <View key={skill.id || idx} style={styles.skillBadge}>
                  <Text style={styles.skillName}>
                    {skill.name} {skill.level ? `(${skill.level})` : ""}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* 6. Certifications */}
        {certifications.length > 0 ? (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Certifications & Awards</Text>
            {certifications.map((cert, idx) => (
              <View key={cert.id || idx} style={{ marginBottom: 2, flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontFamily: isSerif ? "Times-Bold" : "Helvetica-Bold" }}>{cert.name}</Text>
                <Text style={styles.itemDates}>{cert.issuer} ({cert.date})</Text>
              </View>
            ))}
          </View>
        ) : null}

      </Page>
    </Document>
  );
};

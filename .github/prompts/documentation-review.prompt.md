---
name: doc-review
description: "Review and enhance documentation for clarity, completeness, and agricultural accuracy"
agent: agent
argument-hint: "[docs folder or file to review]"
tools: ["edit/editFiles", "search/codebase", "search", "read/problems"]
---

# Documentation Review and Enhancement

## Task

Review existing documentation for clarity, completeness, and agricultural domain accuracy. Enhance content structure and fix any quality issues.

## Context

You are reviewing documentation for an agricultural fumigation management system that serves both technical developers and agricultural professionals.

## Instructions

### Analysis Phase

1. **Content Audit**: Analyze existing documentation structure and completeness
2. **Quality Check**: Identify markdown linting issues, broken links, and formatting problems
3. **Agricultural Accuracy**: Verify agricultural terminology and process accuracy
4. **User Journey Mapping**: Ensure documentation supports complete user workflows
5. **Multilingual Assessment**: Check English/Spanish content synchronization

### Enhancement Phase

1. **Structure Optimization**: Improve information architecture and navigation
2. **Content Enhancement**: Add missing information and improve clarity
3. **Agricultural Context**: Enhance agricultural domain explanations and examples
4. **Quality Fixes**: Resolve all linting warnings and formatting issues
5. **Cross-Reference**: Add internal links and related content references

### Quality Gates

- **MANDATORY**: Zero markdown linting warnings
- All agricultural terminology validated by domain experts
- Content tested with both technical and agricultural user personas
- English and Spanish versions synchronized
- All code examples tested and current

### Deliverables

- Improved documentation structure
- Enhanced content with agricultural context
- Fixed formatting and quality issues
- Recommendations for ongoing maintenance
- Quality checklist for future updates

## Success Criteria

- Documentation supports complete user onboarding in < 30 minutes
- Reduced support tickets related to documentation
- Positive feedback from both developer and agricultural user testing
- 100% pass rate on all quality gates

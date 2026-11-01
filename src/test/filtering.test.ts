import { describe, it, expect, beforeEach } from 'vitest';
import { getCertificates, getProjects, saveProject } from '../lib/api';

describe('Project & Certificate Filtering & Visibility Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('filters projects by category correctly', async () => {
    const allProjects = await getProjects();
    expect(allProjects.length).toBeGreaterThan(0);

    const fullStackOnly = await getProjects({ category: 'Full-Stack' });
    expect(fullStackOnly.every((p) => p.category === 'Full-Stack')).toBe(true);
  });

  it('searches projects by keyword or tech stack', async () => {
    const searchResult = await getProjects({ search: 'Telemetry' });
    expect(searchResult.length).toBeGreaterThan(0);
    expect(searchResult[0].title).toContain('Telemetry');
  });

  it('enforces publication visibility on public requests', async () => {
    // Add a draft project
    const draftProject = await saveProject({
      title: 'Secret Unreleased System',
      slug: 'secret-system',
      short_description: 'Classified internal prototype',
      category: 'Cybersecurity',
      is_published: false,
    });

    // Public request (onlyPublished: true)
    const publicProjects = await getProjects({ onlyPublished: true });
    expect(publicProjects.find((p) => p.id === draftProject.id)).toBeUndefined();

    // Admin request (all)
    const adminProjects = await getProjects({ onlyPublished: false });
    expect(adminProjects.find((p) => p.id === draftProject.id)).toBeDefined();
  });

  it('filters and sorts certificates accurately', async () => {
    const allCerts = await getCertificates();
    expect(allCerts.length).toBeGreaterThan(0);

    // Filter by category
    const cloudOnly = await getCertificates({ category: 'Cloud Architecture' });
    expect(cloudOnly.every((c) => c.category === 'Cloud Architecture')).toBe(true);

    // Sort by name
    const sortedByName = await getCertificates({ sortBy: 'name_asc' });
    for (let i = 0; i < sortedByName.length - 1; i++) {
      expect(sortedByName[i].name.localeCompare(sortedByName[i + 1].name)).toBeLessThanOrEqual(0);
    }
  });
});

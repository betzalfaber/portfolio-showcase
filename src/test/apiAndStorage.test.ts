import { describe, it, expect, beforeEach } from 'vitest';
import {
  getProfile,
  updateProfile,
  saveProject,
  deleteProject,
  getProjects,
  saveCertificate,
  deleteCertificate,
  getCertificates,
  uploadPortfolioMedia
} from '../lib/api';

describe('Data Layer Operations & Storage Restriction Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('performs Profile read and update operations', async () => {
    const original = await getProfile();
    expect(original.full_name).toBeDefined();

    const updated = await updateProfile({ full_name: 'Cipher Nexus Lead' });
    expect(updated.full_name).toBe('Cipher Nexus Lead');

    const retrieved = await getProfile();
    expect(retrieved.full_name).toBe('Cipher Nexus Lead');
  });

  it('performs Project CRUD operations', async () => {
    const created = await saveProject({
      title: 'Quantum Mesh Broker',
      slug: 'quantum-mesh',
      short_description: 'High performance event routing engine',
      category: 'Cloud & Systems',
      technologies: ['Rust', 'gRPC'],
      is_published: true,
    });
    expect(created.id).toBeDefined();

    const listAfterAdd = await getProjects();
    expect(listAfterAdd.some((p) => p.id === created.id)).toBe(true);

    await deleteProject(created.id);
    const listAfterDelete = await getProjects();
    expect(listAfterDelete.some((p) => p.id === created.id)).toBe(false);
  });

  it('performs Certificate CRUD operations', async () => {
    const created = await saveCertificate({
      name: 'Certified Cloud Security Specialist',
      issuing_organization: 'Nexus Authority',
      credential_id: 'NEXUS-SEC-001',
      verification_url: 'https://nexus.io/verify/001',
      issue_date: '2025-01-01',
      image_preview: 'https://example.com/cert.png',
      is_published: true,
    });
    expect(created.id).toBeDefined();

    const certs = await getCertificates();
    expect(certs.some((c) => c.id === created.id)).toBe(true);

    await deleteCertificate(created.id);
    const certsAfterDel = await getCertificates();
    expect(certsAfterDel.some((c) => c.id === created.id)).toBe(false);
  });

  it('enforces file upload size restrictions (> 10MB)', async () => {
    // 12MB simulated file
    const largeBlob = new Blob([new Uint8Array(12 * 1024 * 1024)], { type: 'image/png' });
    const largeFile = new File([largeBlob], 'oversized.png', { type: 'image/png' });

    await expect(uploadPortfolioMedia(largeFile)).rejects.toThrow(/exceeds the 10MB limit/);
  });

  it('enforces file upload type restrictions (unauthorized MIME types)', async () => {
    // Disallowed executable file
    const exeBlob = new Blob(['malicious payload'], { type: 'application/x-msdownload' });
    const exeFile = new File([exeBlob], 'script.exe', { type: 'application/x-msdownload' });

    await expect(uploadPortfolioMedia(exeFile)).rejects.toThrow(/File type not supported/);
  });
});

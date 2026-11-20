/********************************************************************************
 * Copyright (c) 2026 Catena-X Automotive Network e.V.
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * AI Disclosure: This file was entirely AI-generated.
 * The AI-generated portions are made available under CC0-1.0 and not subject
 * to the project's license. The human contributor has reviewed and verified
 * that the code is correct.
 *
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: Claude Code (claude-fable-5-2)
 ********************************************************************************/

import type { CoreResponse } from '@dataspace-mgm/core-http';
import type { ApplicationSummaryAnemic } from '../../domain/anemics/application-summary.anemic';
import type { ApplicationWithReviewAnemic } from '../../domain/anemics/application-with-review.anemic';
import type { ApplicationAnemic } from '../../domain/anemics/application.anemic';
import type { DocumentInfoAnemic } from '../../domain/anemics/document-info.anemic';
import type { ApplicationCreateInput } from '../../domain/data/application-create-input.data';
import type { ApplicationUpdateInput } from '../../domain/data/application-update-input.data';
import type { CreatedApplicationData } from '../../domain/data/created-application.data';
import type { DocumentContent } from '../../domain/data/document-content.data';
import type { DocumentUploadInput } from '../../domain/data/document-upload-input.data';
import type { AllApplicationsFilter, OwnApplicationsFilter } from '../../domain/data/list-filters.data';
import type { PageData } from '../../domain/data/page.data';
import type { SubmitInput } from '../../domain/data/submit-input.data';
import type { ApplicationRepository } from '../../domain/repositories/application.repository';
import type { C1M2Client } from '../data/c1-m2-infrastructure.data';
import { C1M2Response } from '../helpers/c1-m2-response.helper';
import { ApplicationMapper } from '../mappers/application.mapper';
import { DocumentMapper } from '../mappers/document.mapper';

/** The status of `createApplication` for a repetition with the same verification attestation (201 = created). */
const REPEATED = 200;

/** A filter value that may be repeated in the query; an empty list is no filter. */
const repeated = <T>(values: ReadonlyArray<T> | undefined): T[] | undefined => (values?.length ? [...values] : undefined);

/**
 * Adapter over HTTP of the applications: the own ones of the applicant (paths under /applications, README 7.2 to
 * 7.11) and all of the installation for OSP staff (paths under /osp/applications, README 7.12 to 7.14). The generated
 * client checks path, parameters and bodies against openapi.yaml; createCoreClient adds the CSRF token to the writes.
 */
export class ApplicationHttpRepository implements ApplicationRepository {
  constructor(private readonly client: C1M2Client) {}

  public async create(input: ApplicationCreateInput): Promise<CreatedApplicationData> {
    const result = await this.client.POST('/applications', { body: ApplicationMapper.createToDto(input) });
    const dto = await C1M2Response.data(Promise.resolve(result));
    return { application: ApplicationMapper.toAnemic(dto), repeated: result.response.status === REPEATED };
  }

  public async listOwn(filter: OwnApplicationsFilter): Promise<PageData<ApplicationSummaryAnemic>> {
    const dto = await C1M2Response.data(
      this.client.GET('/applications', { params: { query: { status: repeated(filter.status), page: filter.page, size: filter.size } } }),
    );
    return ApplicationMapper.pageToAnemic(dto);
  }

  public async getOwn(applicationId: string): Promise<ApplicationWithReviewAnemic | null> {
    const dto = await C1M2Response.orNull(
      C1M2Response.data(this.client.GET('/applications/{applicationId}', { params: { path: { applicationId } } })),
    );
    return dto ? ApplicationMapper.withReviewToAnemic(dto) : null;
  }

  public async update(applicationId: string, input: ApplicationUpdateInput): Promise<ApplicationAnemic | null> {
    const dto = await C1M2Response.orNull(
      C1M2Response.data(
        this.client.PATCH('/applications/{applicationId}', { params: { path: { applicationId } }, body: ApplicationMapper.updateToDto(input) }),
      ),
    );
    return dto ? ApplicationMapper.toAnemic(dto) : null;
  }

  public async replaceAttestation(applicationId: string, attestation: string): Promise<ApplicationAnemic | null> {
    const dto = await C1M2Response.orNull(
      C1M2Response.data(
        this.client.PUT('/applications/{applicationId}/attestation', { params: { path: { applicationId } }, body: { attestation } }),
      ),
    );
    return dto ? ApplicationMapper.toAnemic(dto) : null;
  }

  /**
   * multipart/form-data with the parts `file` (the content with its file name) and `documentType` (README 7.7). The
   * browser sets the boundary; the typed `body` only names the parts for the generated client.
   */
  public async uploadDocument(applicationId: string, input: DocumentUploadInput): Promise<DocumentInfoAnemic | null> {
    const dto = await C1M2Response.orNull(
      C1M2Response.data(
        this.client.POST('/applications/{applicationId}/documents', {
          params: { path: { applicationId } },
          body: { file: input.fileName, documentType: input.documentType },
          bodySerializer: () => {
            const form = new FormData();
            form.append('file', input.file, input.fileName);
            form.append('documentType', input.documentType);
            return form;
          },
        }),
      ),
    );
    return dto ? DocumentMapper.toAnemic(dto) : null;
  }

  public async getDocument(applicationId: string, documentId: string): Promise<DocumentContent | null> {
    return C1M2Response.orNull(
      this.contentOf(
        this.client.GET('/applications/{applicationId}/documents/{documentId}', { params: { path: { applicationId, documentId } }, parseAs: 'blob' }),
        documentId,
      ),
    );
  }

  public async deleteDocument(applicationId: string, documentId: string): Promise<boolean> {
    const deleted = await C1M2Response.orNull(
      C1M2Response.data(
        this.client.DELETE('/applications/{applicationId}/documents/{documentId}', { params: { path: { applicationId, documentId } } }),
      ).then(() => true),
    );
    return deleted ?? false;
  }

  public async submit(applicationId: string, input: SubmitInput): Promise<ApplicationAnemic | null> {
    const dto = await C1M2Response.orNull(
      C1M2Response.data(
        this.client.POST('/applications/{applicationId}/submit', { params: { path: { applicationId } }, body: ApplicationMapper.submitToDto(input) }),
      ),
    );
    return dto ? ApplicationMapper.toAnemic(dto) : null;
  }

  public async withdraw(applicationId: string): Promise<ApplicationAnemic | null> {
    const dto = await C1M2Response.orNull(
      C1M2Response.data(this.client.POST('/applications/{applicationId}/withdraw', { params: { path: { applicationId } } })),
    );
    return dto ? ApplicationMapper.toAnemic(dto) : null;
  }

  public async listAll(filter: AllApplicationsFilter): Promise<PageData<ApplicationSummaryAnemic>> {
    const dto = await C1M2Response.data(
      this.client.GET('/osp/applications', {
        params: {
          query: {
            status: repeated(filter.status),
            kind: repeated(filter.kind),
            verification: repeated(filter.verification),
            companyId: filter.companyId,
            page: filter.page,
            size: filter.size,
          },
        },
      }),
    );
    return ApplicationMapper.pageToAnemic(dto);
  }

  public async getAny(applicationId: string): Promise<ApplicationWithReviewAnemic | null> {
    const dto = await C1M2Response.orNull(
      C1M2Response.data(this.client.GET('/osp/applications/{applicationId}', { params: { path: { applicationId } } })),
    );
    return dto ? ApplicationMapper.withReviewToAnemic(dto) : null;
  }

  public async getAnyDocument(applicationId: string, documentId: string): Promise<DocumentContent | null> {
    return C1M2Response.orNull(
      this.contentOf(
        this.client.GET('/osp/applications/{applicationId}/documents/{documentId}', {
          params: { path: { applicationId, documentId } },
          parseAs: 'blob',
        }),
        documentId,
      ),
    );
  }

  /** A download: the bytes, the `Content-Type` and the file name of `Content-Disposition` (README 7.8, 7.14). */
  private async contentOf(call: Promise<CoreResponse<Blob>>, documentId: string): Promise<DocumentContent> {
    const result = await call;
    const content = await C1M2Response.data(Promise.resolve(result));
    return {
      content,
      contentType: result.response.headers.get('content-type') ?? content.type,
      fileName: DocumentMapper.fileNameOf(result.response.headers.get('content-disposition'), documentId),
    };
  }
}

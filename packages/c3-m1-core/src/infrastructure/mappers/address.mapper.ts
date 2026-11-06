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
 * Assisted-By: Claude Code (claude-opus-5-5)
 ********************************************************************************/

import type { AddressFieldsAnemic } from '../../domain/anemics/address-fields.anemic';
import type { AddressAnemic } from '../../domain/anemics/address.anemic';
import type { AddressDto, AddressFieldsDto } from '../data/c3-m1-infrastructure.data';

/** C3-M1 `Address` / `AddressFields` ↔ anemics. Optional parts are null in the UI, left out on the wire. */
export class AddressMapper {
  public static fieldsToAnemic(dto: AddressFieldsDto): AddressFieldsAnemic {
    return {
      street: dto.street,
      houseNumber: dto.houseNumber ?? null,
      addressAddition: dto.addressAddition ?? null,
      postalCode: dto.postalCode ?? null,
      city: dto.city,
      region: dto.region ?? null,
    };
  }

  public static toAnemic(dto: AddressDto): AddressAnemic {
    return { ...AddressMapper.fieldsToAnemic(dto), countryCode: dto.countryCode };
  }

  public static fieldsToDto(address: AddressFieldsAnemic): AddressFieldsDto {
    return {
      street: address.street.trim(),
      houseNumber: address.houseNumber?.trim() || null,
      addressAddition: address.addressAddition?.trim() || null,
      postalCode: address.postalCode?.trim() || null,
      city: address.city.trim(),
      region: address.region?.trim() || null,
    };
  }

  public static toDto(address: AddressAnemic): AddressDto {
    return { ...AddressMapper.fieldsToDto(address), countryCode: address.countryCode };
  }
}

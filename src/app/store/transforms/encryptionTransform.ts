/**
 * Redux Persist Transform for Encrypting Sensitive State
 * HIPAA-compliant encryption for mental health data
 */

import encryptionService from "@shared/utils/encryption";
import { logger } from "@shared/utils/logger";
import { createTransform } from "redux-persist";

// TypeScript interfaces for encrypted state
interface EncryptedState {
  _encrypted: boolean;
  _version: string;
  _slice: string;
  data: string;
}

/**
 * Encryption transform for Redux Persist
 * Encrypts sensitive slices before storage, decrypts on rehydration
 */
export const encryptionTransform = createTransform(
  // Encrypt on persist (inbound)
  (inboundState: any, key: string): any => {
    try {
      // Only encrypt sensitive slices containing PHI
      const sensitiveSlices = [
        "auth",
        "user",
        "mood",
        "chat",
        "assessment",
        "journal",
      ];

      if (!sensitiveSlices.includes(key)) {
        return inboundState;
      }

      const encrypted = encryptionService.encrypt(inboundState);

      if (!encrypted) {
        logger.warn(
          `Failed to encrypt ${key} slice - storing unencrypted as fallback`,
        );
        return inboundState;
      }

      return {
        _encrypted: true,
        _version: "1.0",
        _slice: key,
        data: encrypted,
      };
    } catch (error) {
      logger.error(`Encryption transform error for ${key}:`, error);
      return inboundState;
    }
  },

  // Decrypt on rehydrate (outbound)
  (outboundState: any, key: string) => {
    try {
      // Check if state is encrypted
      if (outboundState && outboundState._encrypted) {
        const decrypted = encryptionService.decrypt(outboundState.data);

        if (!decrypted) {
          logger.error(`Failed to decrypt ${key} slice - using initial state`);
          return undefined; // Redux will use initial state
        }

        return decrypted;
      }

      // Not encrypted (non-sensitive slice or legacy data)
      return outboundState;
    } catch (error) {
      logger.error(`Decryption transform error for ${key}:`, error);
      return undefined;
    }
  },

  // Apply to these slices only
  { whitelist: ["auth", "user", "mood", "chat", "assessment", "journal"] },
);

export default encryptionTransform;

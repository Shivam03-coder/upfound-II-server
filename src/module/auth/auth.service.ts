import admin from "@src/common/configs/firebase.config";
import { IoauthData } from "./auth.dto.types";
import { ValidationError } from "@src/common/utils/error.utils";

class AuthServices {
  public static async firebaseAuthLogin(idToken: string): Promise<IoauthData> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      const { email, name, picture } = decodedToken;
      if (!email || !name || !picture) {
        throw new ValidationError("Missing required user info");
      }

      return { email, name, picture };
    } catch (error) {
      console.error("[AuthServices] Firebase Auth Error:", error);
      throw new ValidationError("Invalid or expired Firebase token");
    }
  }
}

export default AuthServices;

import admin from "@src/configs/firebase.config";
import { ValidationError } from "@src/utils/error.utils";
import { IoauthData } from "./auth.dto.types";

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

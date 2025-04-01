import { AuthModel, User } from '../model/AuthModel';

export interface AuthView {
  onSignInSuccess(user: User): void;
  onSignInError(error: Error): void;
  onSignOutSuccess(): void;
  onSignOutError(error: Error): void;
  onLoadingStart(): void;
  onLoadingEnd(): void;
}

export class AuthPresenter {
  private model: AuthModel;
  private view: AuthView;

  constructor(view: AuthView) {
    this.model = AuthModel.getInstance();
    this.view = view;
  }

  public async signIn(): Promise<void> {
    try {
      this.view.onLoadingStart();
      const user = await this.model.signIn();
      this.view.onSignInSuccess(user);
    } catch (error) {
      this.view.onSignInError(error as Error);
    } finally {
      this.view.onLoadingEnd();
    }
  }

  public async signOut(): Promise<void> {
    try {
      this.view.onLoadingStart();
      await this.model.signOut();
      this.view.onSignOutSuccess();
    } catch (error) {
      this.view.onSignOutError(error as Error);
    } finally {
      this.view.onLoadingEnd();
    }
  }

  public async checkAuthState(): Promise<void> {
    try {
      this.view.onLoadingStart();
      const user = await this.model.getCurrentUser();
      if (user) {
        this.view.onSignInSuccess(user);
      }
    } catch (error) {
      console.error('Check auth state error:', error);
    } finally {
      this.view.onLoadingEnd();
    }
  }
} 
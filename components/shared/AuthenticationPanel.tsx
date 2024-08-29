import { FC } from 'react';
import { AuthenticationPanel, contentTypes } from '../../models';
import SignUpForm from './userAuthentication/sign-up-form/sign-up-form.component';
import SignInForm from './userAuthentication/sign-in-form/sign-in-form.component';

type Props = Readonly<{
  item: AuthenticationPanel;
}>;

export const AuthenticationPanelComponent: FC<Props> = (props) => {
    
  return (
    <div className='authentication-container'>
      <SignInForm />
      <SignUpForm />
    </div>
  );
};

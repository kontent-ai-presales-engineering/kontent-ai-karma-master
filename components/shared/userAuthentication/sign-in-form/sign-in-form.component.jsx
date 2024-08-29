import { useState, useContext } from "react";
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { signInWithGooglePopup, createUserDocumentFromAuth, signInAuthUserWithEmailAndPassword } from "../../../../utils/firebase/firebase.utils";
import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';

import { UserContext } from "../../../../contexts/user.context";

const defaultFormFields = {
    email: '',
    password: ''
};

const SignInForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { email, password } = formFields;

    const { setCurrentUser } = useContext(UserContext);

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };

      const returnUrlParams = useSearchParams();
      const returnUrl = returnUrlParams.get('return');
      const router = useRouter();
      

    const signInWithGoogle = async () => {
      const {user} = await signInWithGooglePopup();
      setCurrentUser(user);
      await createUserDocumentFromAuth(user);

      if(returnUrl === null) {
        resetFormFields();
        return;
      }

      router.push(returnUrl);
      
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
          const { user } = await signInAuthUserWithEmailAndPassword(
            email,
            password
          );
          setCurrentUser(user);

          if(returnUrl === null) {
            resetFormFields();
            return;
          }
    
          router.push(returnUrl);

        } catch (error) {
          switch (error.code) {
            case 'auth/wrong-password':
              alert('incorrect password for email');
              break;
            case 'auth/user-not-found':
              alert('no user associated with this email');
              break;
            default:
              console.log(error);
          }
        }
      };

    const handleChange = (event) => {
        const { name, value } = event.target;
    
        setFormFields({ ...formFields, [name]: value });
      };

    return (
      <div className='sign-up-container'>
      <h2>Already have an account?</h2>
      <span>Sign in with your email and password</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          label='Email'
          type='email'
          required
          onChange={handleChange}
          name='email'
          value={email}
        />

        <FormInput
          label='Password'
          type='password'
          required
          onChange={handleChange}
          name='password'
          value={password}
        />
        <div className='buttons-container'>
          <Button type='submit'>Sign In</Button>
          <Button type='button' buttonType='google' onClick={signInWithGoogle}>
            Google sign in
          </Button>
        </div>
      </form>
    </div>
    )
}

export default SignInForm;
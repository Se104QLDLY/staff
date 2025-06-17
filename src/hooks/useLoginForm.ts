import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

export interface LoginFormInputs {
  username: string;
  password: string;
}

const schema = yup.object().shape({
  username: yup.string().required('Vui lòng nhập tên đăng nhập'),
  password: yup.string().required('Vui lòng nhập mật khẩu'),
});

export const useLoginForm = () => {
  const [loginType, setLoginType] = useState<'admin' | 'staff' | 'agency'>('staff');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    console.log(data, { loginType });
    // Simulate login
    setIsLoggedIn(true);
    setUserName(data.username);
    
    // Navigate based on login type
    switch (loginType) {
      case 'admin':
        // Redirect to admin application
        window.location.href = '/admin';
        break;
      case 'staff':
        // Stay in current staff application
        navigate('/');
        break;
      case 'agency':
        // Redirect to agency application
        window.location.href = '/agency';
        break;
      default:
        navigate('/');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setShowAccountMenu(false);
  };
  
  const toggleAccountMenu = () => {
    setShowAccountMenu(!showAccountMenu);
  };

  return {
    loginType,
    setLoginType,
    isLoggedIn,
    setIsLoggedIn,
    showAccountMenu,
    userName,
    toggleAccountMenu,
    handleLogout,
    register,
    handleSubmit,
    errors,
    onSubmit
  };
};
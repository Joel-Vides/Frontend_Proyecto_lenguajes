import { FormikProvider, useFormik } from 'formik';
import { Title } from '../../../components/shared/Title';
import { loginInitialValues, loginValidationSchema } from '../../../../infrastructure/interfaces/validations/login.validation';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../stores/authStore';

export const LoginPage = () => {

    const { errorMessage, login, authenticated } = useAuthStore();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: loginInitialValues,
        validationSchema: loginValidationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async(formValues) => {
            await login(formValues);
        }
    });

    useEffect(() => {
        if (authenticated) {
            navigate("/")
        }
    }, [authenticated]);

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
            <div className='bg-white rounded-xl shadow-lg p-8 w-full max-w-md'>
                <Title text='Iniciar Sesión' />

                {typeof errorMessage === 'string' && errorMessage.trim().length > 0 && (
                    <div className='bg-red-100 border border-red-400 px-4 py-3 rounded relative'>
                        <span>{errorMessage}</span>
                    </div>
                )}

                <FormikProvider value={formik}>
                    <form onSubmit={formik.handleSubmit} className='flex flex-col gap-6 mt-4'>
                        {/* Campo Email */}
                        <div>
                            <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-2'>
                                Correo Electrónico
                            </label>
                            <input
                                id='email'
                                type="text"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                autoFocus
                                className='w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className='text-red-500 text-xs mt-2'>
                                    {formik.errors.email}
                                </div>
                            )}
                        </div>

                        {/* Campo Contraseña */}
                        <div>
                            <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-2'>
                                Contraseña
                            </label>
                            <input
                                id='password'
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                className='w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                            />
                            {formik.touched.password && formik.errors.password && (
                                <div className='text-red-500 text-xs mt-2'>
                                    {formik.errors.password}
                                </div>
                            )}
                        </div>

                        {/* Botón de Login */}
                        <button type='submit' className='bg-cyan-700 hover:bg-cyan-800 text-white font-semibold p-3 rounded-lg mt-4 transition-colors'>
                            Ingresar
                        </button>

                        {/* Separador */}
                        <hr className='border border-gray-300 my-4' />
                    </form>
                </FormikProvider>

            </div>
        </div>
    );
}

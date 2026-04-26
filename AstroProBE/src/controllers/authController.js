import { supabase } from '../config/supabase.js';

/**
 * Enterprise Audit Logger Helper
 */
const logAction = async (userId, action, status, metadata = {}, error = null) => {
    await supabase.from('audit_logs').insert([{
        user_id: userId,
        action_type: action,
        status: status,
        metadata: metadata,
        error_message: error
    }]);
};

export const register = async (req, res) => {
    const { email, password, fullName } = req.body;

    // Supabase automatically handles email verification if enabled in your dashboard
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: fullName }
        }
    });

    if (error) {
        await logAction(null, 'AUTH_REGISTER', 'FAILURE', { email }, error.message);
        return res.status(400).json({ success: false, message: error.message });
    }

    await logAction(data.user?.id, 'AUTH_REGISTER', 'SUCCESS', { email });
    res.status(201).json({ 
        success: true, 
        message: 'Registration successful. Please check your email for verification.' 
    });
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        await logAction(null, 'AUTH_LOGIN', 'FAILURE', { email }, error.message);
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    await logAction(data.user.id, 'AUTH_LOGIN', 'SUCCESS', { ip: req.ip });
    
    res.status(200).json({
        success: true,
        session: data.session,
        user: data.user
    });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    // This sends the reset link to the user's email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
    });

    if (error) {
        return res.status(400).json({ success: false, message: error.message });
    }

    await logAction(null, 'AUTH_PASSWORD_RESET_REQUEST', 'SUCCESS', { email });
    res.status(200).json({ success: true, message: 'Password reset link sent to email.' });
};

export const resetPassword = async (req, res) => {
    const { newPassword } = req.body;

    // The user must be authenticated (via the recovery link) to call this
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) {
        await logAction(req.user?.id, 'AUTH_PASSWORD_RESET_COMPLETE', 'FAILURE', {}, error.message);
        return res.status(400).json({ success: false, message: error.message });
    }

    await logAction(data.user.id, 'AUTH_PASSWORD_RESET_COMPLETE', 'SUCCESS');
    res.status(200).json({ success: true, message: 'Password updated successfully.' });
};

export const logout = async (req, res) => {
    const { error } = await supabase.auth.signOut();
    if (error) return res.status(500).json({ success: false, message: error.message });
    
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
};
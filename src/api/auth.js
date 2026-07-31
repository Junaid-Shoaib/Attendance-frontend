import api from './client';

// Web sessions use a fixed device identifier so the backend's device
// binding logic treats "this browser" as a single, admin-approved device
// per user (distinct from any of the user's mobile app devices).
function webDeviceContext() {
  return {
    device_id: 'web-portal',
    device_name: navigator.userAgent.slice(0, 60),
    platform: 'web',
    os_version: navigator.platform || 'unknown',
    app_version: '1.0.0',
    is_rooted_or_jailbroken: false,
  };
}

export async function login(email, password) {
  const { data } = await api.post('/auth/login', {
    email,
    password,
    ...webDeviceContext(),
  });

  localStorage.setItem('auth_token', data.data.token);
  localStorage.setItem('auth_user', JSON.stringify(data.data.user));

  return data.data;
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
}

export async function me() {
  const { data } = await api.get('/auth/me');
  return data.data;
}

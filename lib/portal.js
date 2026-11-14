// Edge-safe helpers shared by middleware, layouts and forms.
export const PORTALS = ['student', 'faculty', 'admin'];
export const dashboardFor = (role) => (role === 'admin' ? '/admin' : role === 'faculty' ? '/faculty' : '/student');
export const loginFor = (role) => `/login/${PORTALS.includes(role) ? role : 'student'}`;

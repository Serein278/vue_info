const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  student: state => state.user.student,
  stuId: state => state.user.student.stuId,
  roles: state => state.user.roles,
  roleId: state => state.user.roleId,
  cId: state => state.user.counselor.cId,
  permission_routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes
}
export default getters

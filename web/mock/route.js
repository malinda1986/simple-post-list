import { Constant } from './_utils'
const { ApiPrefix } = Constant

const database = [
  {
    id: '3',
    name: 'Posts',
    icon: 'message',
    route: '/posts',
  },
  {
    id: '4',
    menuParentId: '-1',
    breadcrumbParentId: '3',
    name: 'View Post',
    icon: 'bars',
    route: '/posts/:id',
  },
]
module.exports = {
  [`GET ${ApiPrefix}/routes`](req, res) {
    res.status(200).json(database)
  },
}

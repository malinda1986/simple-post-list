import { Constant } from './_utils'
const { ApiPrefix } = Constant

const database = [
  {
    id: '2',
    name: 'Launches',
    icon: 'rocket',
    route: '/launches',
  },
]
module.exports = {
  [`GET ${ApiPrefix}/routes`](req, res) {
    res.status(200).json(database)
  },
}

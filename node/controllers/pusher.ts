import * as Pusher from 'pusher';
import * as dotenv from 'dotenv';

dotenv.load({ path: '.env' });

const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.NG_APP_KEY,
  secret: process.env.APP_SECRET,
  cluster: process.env.NG_APP_CLUSTER,
  encrypted: true
});

export default class PusherController {
  create = (req, res) => {
    console.log(req.user);
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const presenceData = {
      user_id: req.user.id,
    };
    const auth = pusher.authenticate(socketId, channel, presenceData);
    res.send(auth);
  }
}

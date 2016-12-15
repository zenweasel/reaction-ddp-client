import config from 'config';
import DDPClient from 'ddp';
import Login from 'ddp-login';

const RemoteMeteor = {
  /**
   * Call a Meteor method
   * @param {String} method - the method name to call
   * @param {Array} options - and array of args to pass to the method
   * @param {Function} callback - a callback to pass to the method
   */
  call(method, options, callback) {
    if (typeof method !== 'string') {
      throw Error('call method requires a method name');
    }

    if (!Array.isArray(options)) {
      throw Error('call method requires an array for the options argument');
    }

    if (typeof callback !== 'function') {
      throw Error('call method requires a callback function');
    }

    const conf = config.get('remote_host');

    const { host, port, ssl, username, password } = conf;
    // make sure ssl variable can be set properly through environment
    ssl = ( ssl === 'true' );

    if (!host || !port || !username || !password) {
      throw Error('Missing connection info.');
    }

    const client = new DDPClient({ host, port, ssl });

    client.connect((err) => {
      if (err) {
        throw Error(err.reason);
      }

      Login.loginWithUsername(client, username, password, (error) => {
        if (error) {
          throw Error(error.reason);
        }

        client.call(method, options, (e, r) => callback(e, r, client));
      });
    });
  }
};

export default RemoteMeteor;

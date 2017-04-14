import { Meteor } from 'meteor/meteor';

const setupDIMSE = () => {
    // Terminate existing DIMSE servers and sockets and clean up the connection object
    DIMSE.connection.reset();

    // Get the new server configuration
    const server = getCurrentServer();

    // Stop here if the new server is not of DIMSE type
    if (!server || server.type !== 'dimse') {
        return;
    }

    // Check if peers were defined in the server configuration and throw an error if not
    const peers = server.peers;
    if (!peers || !peers.length) {
        console.error('dimse-config: ' + 'No DIMSE Peers provided.');
        throw new Meteor.Error('dimse-config', 'No DIMSE Peers provided.');
    }

    // Add all the DIMSE peers, establishing the connections
    console.log('Adding DIMSE peers');
    try {
        peers.forEach(peer => DIMSE.connection.addPeer(peer));
    } catch(error) {
        console.error('dimse-addPeers: ' + error);
        throw new Meteor.Error('dimse-addPeers', error);
    }
};

// Setup the DIMSE connections on startup or when the current server is changed
Meteor.startup(() => {
    CurrentServer.find().observe({
        added: setupDIMSE,
        changed: setupDIMSE
    });
});

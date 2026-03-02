using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;

namespace Hospital.API.Hubs
{

    [Authorize]
    public class VideoCallHub : Hub
    {
        // İkisi də öz appointment room-una qoşulur
        public async Task JoinRoom(string appointmentId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, appointmentId);
            await Clients.OthersInGroup(appointmentId)
                         .SendAsync("UserJoined", Context.ConnectionId);
        }

        public async Task LeaveRoom(string appointmentId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, appointmentId);
            await Clients.OthersInGroup(appointmentId)
                         .SendAsync("UserLeft", Context.ConnectionId);
        }

        // ── WebRTC Signaling ──
        public async Task SendOffer(string appointmentId, string offer)
            => await Clients.OthersInGroup(appointmentId)
                            .SendAsync("ReceiveOffer", offer);

        public async Task SendAnswer(string appointmentId, string answer)
            => await Clients.OthersInGroup(appointmentId)
                            .SendAsync("ReceiveAnswer", answer);

        public async Task SendIceCandidate(string appointmentId, string candidate)
            => await Clients.OthersInGroup(appointmentId)
                            .SendAsync("ReceiveIceCandidate", candidate);

        // ── Zəng axışı ──
        public async Task CallUser(string appointmentId, string callerName)
            => await Clients.OthersInGroup(appointmentId)
                            .SendAsync("IncomingCall", callerName);

        public async Task AcceptCall(string appointmentId)
            => await Clients.OthersInGroup(appointmentId)
                            .SendAsync("CallAccepted");

        public async Task RejectCall(string appointmentId)
            => await Clients.OthersInGroup(appointmentId)
                            .SendAsync("CallRejected");

        public async Task EndCall(string appointmentId)
            => await Clients.OthersInGroup(appointmentId)
                            .SendAsync("CallEnded");
    }
}

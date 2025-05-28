export interface WebRTCConnectionOptions {
  client: any; // RealtimeClient but typed loosely to avoid TS errors
  onRemoteStream?: (stream: MediaStream) => void;
}

export class WebRTCConnection {
  private pc: RTCPeerConnection;
  private client: any;
  private localStream: MediaStream | null = null;
  private onRemoteStream?: (stream: MediaStream) => void;

  constructor(options: WebRTCConnectionOptions) {
    this.pc = new RTCPeerConnection();
    this.client = options.client;
    this.onRemoteStream = options.onRemoteStream;

    this.pc.ontrack = (evt) => {
      const [stream] = evt.streams;
      if (stream && this.onRemoteStream) {
        this.onRemoteStream(stream);
      }
    };

    this.pc.onicecandidate = (e) => {
      if (e.candidate) {
        this.client?.send?.('webrtc.ice_candidate', e.candidate.toJSON());
      }
    };

    this.client?.on?.('webrtc.answer', async (answer: RTCSessionDescriptionInit) => {
      await this.pc.setRemoteDescription(answer);
    });

    this.client?.on?.('webrtc.ice_candidate', async (cand: RTCIceCandidateInit) => {
      await this.pc.addIceCandidate(cand);
    });
  }

  async start() {
    this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.localStream.getTracks().forEach((t) => this.pc.addTrack(t, this.localStream!));

    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    this.client?.send?.('webrtc.offer', offer);

    return this.localStream;
  }

  getLocalStream() {
    return this.localStream;
  }

  async setRemoteDescription(desc: RTCSessionDescriptionInit) {
    await this.pc.setRemoteDescription(desc);
  }

  async addIceCandidate(candidate: RTCIceCandidateInit) {
    await this.pc.addIceCandidate(candidate);
  }

  close() {
    this.pc.close();
    if (this.localStream) {
      this.localStream.getTracks().forEach((t) => t.stop());
    }
  }
}

export interface WebRTCConnectionOptions {
  onRemoteStream?: (stream: MediaStream) => void;
}

export class WebRTCConnection {
  private pc: RTCPeerConnection;
  private localStream: MediaStream | null = null;
  private onRemoteStream?: (stream: MediaStream) => void;

  constructor(options: WebRTCConnectionOptions = {}) {
    this.pc = new RTCPeerConnection();
    this.onRemoteStream = options.onRemoteStream;
    this.pc.ontrack = (evt) => {
      const [stream] = evt.streams;
      if (stream && this.onRemoteStream) {
        this.onRemoteStream(stream);
      }
    };
  }

  async startLocalStream() {
    this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.localStream.getTracks().forEach((t) => this.pc.addTrack(t, this.localStream!));
    return this.localStream;
  }

  getLocalStream() {
    return this.localStream;
  }

  async createOffer() {
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    return offer;
  }

  async setRemoteDescription(desc: RTCSessionDescriptionInit) {
    await this.pc.setRemoteDescription(desc);
  }

  async addIceCandidate(candidate: RTCIceCandidateInit) {
    await this.pc.addIceCandidate(candidate);
  }

  onIceCandidate(cb: (candidate: RTCIceCandidateInit) => void) {
    this.pc.onicecandidate = (e) => {
      if (e.candidate) cb(e.candidate.toJSON());
    };
  }

  close() {
    this.pc.close();
    if (this.localStream) {
      this.localStream.getTracks().forEach((t) => t.stop());
    }
  }
}

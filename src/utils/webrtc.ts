import { RealtimeClient } from '@openai/realtime-api-beta';

export interface WebRTCConnectionOptions {
  client: RealtimeClient;
  onRemoteStream?: (stream: MediaStream) => void;
}

export class WebRTCConnection {
  private pc: RTCPeerConnection;
  private localStream: MediaStream | null = null;
  private onRemoteStream?: (stream: MediaStream) => void;
  private client: RealtimeClient;

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
  }

  async startLocalStream() {
    this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.localStream.getTracks().forEach((t) => this.pc.addTrack(t, this.localStream!));
    return this.localStream;
  }

  async connect() {
    this.onIceCandidate((candidate) => {
      (this.client as any).send('webrtc.ice_candidate', candidate);
    });

    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    (this.client as any).send('webrtc.offer', offer);

    this.client.on('webrtc.answer', async (answer: RTCSessionDescriptionInit) => {
      await this.pc.setRemoteDescription(answer);
    });

    this.client.on(
      'webrtc.ice_candidate',
      async (candidate: RTCIceCandidateInit) => {
        await this.addIceCandidate(candidate);
      }
    );
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

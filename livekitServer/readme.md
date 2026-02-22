docker run --rm -it \
  -p 7880:7880 \
  -p 7881:7881 \
  -p 60000-60100:60000-60100/udp \
  -v $(pwd)/livekit.yaml:/livekit.yaml \
  livekit/livekit-server \
  --config /livekit.yaml
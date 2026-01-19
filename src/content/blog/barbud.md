---
title: "secure video streaming to the internet without port forwarding"
description: "built a network of cameras to give live updates on bar lines in student town"
pubDate: 2026-01-17
---

---
## tl;dr

* **goal**: Build a website to monitor bar lines at Queen's University without compromising the host network's security.
* **tech stack**:
    * **hardware**: TP-Link IP camera, old Lenovo laptop running Debian.
    * **software**: Dockerized setup using `MediaMTX` to convert `RTSP` to `HLS`.
    * **networking**: Cloudflare Tunnel (no port forwarding required).
* **[github](https://github.com/yves-a/bar-camera)**

<br>
<br>

---

## inspiration

At Queen's, there are a couple local bars that have long lines during the school year, and it's hard to know when to leave for the bars to not get hit in a big line.

<br>

A couple years ago a website came out that was a live feed of the main bars in Kingston and it was great. After our internship year, my friends and I came back and the website was no longer around, and we thought we could easily make our own.

## objective

A couple of my friends and I set out to get some IP cameras and set them up in a way that we could see the lines and have a constant live feed.

<br>

We had a friend that had an apartment overlooking two of the main bars, and we wanted to setup a website that would take the live feed from the camera without exposing it to the internet through port forwarding. I didn't want to risk exposing ports to my friend's local network, and I wanted the challenge to see if there was another way.

## initial approach

We initially purchased a TP-Link outdoor camera to use, which worked really well during our initial stages. I worked on the networking side of things while my friends handled everything else. I bought the camera from a local store, and we quickly accessed its stream through `RTSP`.

## struggles getting the stream to the internet

The biggest hurdle was getting the stream out of the local network. From what I was reading online, it was clear that port forwarding was the favored approach, but that's basically like saying, "if someone knocks on port 8554, open the door to the camera." It was just too much of a security risk for me, especially on a friend's home network.

<br>

I didn't like the security concerns of port forwarding, especially with how beginner my skills were. I was afraid I was going to mess something up and leave my friend's network exposed.

<br>

While playing around with different approaches, I stumbled across using a **Cloudflare Tunnel**. The connection is outbound, so instead of the internet "knocking" on the router, my local server reaches out to Cloudflare and says, "I'm a private server for this domain, let's open a secure pipe". Since my server initiates the contact, the router allows it through just like regular web browsing. This meant no open ports and the camera remained invisible to outside scanners.

## hardware required

I already mentioned that we had an IP camera, but we also needed somewhere to run this "server". Luckily, one of my friends had an old Lenovo laptop that we turned into a server. 

<br>

The plan was always to get a Raspberry Pi from another friend, but we didn't live close and he always forgot to bring it when he came to visit. Plus, we had a small, fun project of setting up Debian on that Lenovo laptop, so it was cool learning that too.

## containerization

I am not sure if this was strictly required, but I wanted to learn Docker while I was at it. I set up two different containers: one for fetching the stream and the second for managing it. This second one used `MediaMTX` to provide an `HLS` (HTTP Live Stream) that could be sent to Cloudflare.

<br>

### MediaMTX configuration

```yaml
logLevel: info

rtsp: yes
rtspAddress: :8554

hls: yes
hlsAddress: :8888
hlsVariant: fmp4
hlsSegmentDuration: 2s
hlsAllowOrigin: ""
```


## why MediaMTX? (RTSP vs. HLS)

You might wonder why I didn't just stream the camera feed directly. The camera outputs **RTSP (Real-Time Streaming Protocol)**. While RTSP is great for low-latency security monitors, it has one major flaw: **web browsers can’t play it natively.** 

<br>

To make the feed viewable on a standard website, I had to convert the stream. This is where `MediaMTX` comes in. It acts as a middleman that:

<br>

* **Ingests** the raw RTSP feed from the camera.
* **Repackages** it into HLS (HTTP Live Streaming).
* **Serves** the HLS segments over standard web ports (HTTP/HTTPS).

<br>

By converting to HLS, the video becomes a series of small files that any iPhone or Android browser can load just like a regular website element.

<br>

### main docker file

```yaml
# version: "3.9"

networks:
  public:

services:
  mediamtx:
    image: bluenviron/mediamtx:latest
    container_name: mediamtx
    restart: unless-stopped
    # No host ports required when using Cloudflare Tunnel
    networks: [public]
    environment:
      MTX_PATHS_ALE_SOURCE: ${CAM_ALE}
      MTX_PATHS_TRIN_SOURCE: ${CAM_TRIN}
    env_file:
      - .env
    volumes:
      - ./mediamtx.yml:/mediamtx.yml:ro

  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared
    restart: unless-stopped
    networks: [public]
    command: tunnel run
    environment:
      TUNNEL_TOKEN: ${CLOUDFLARE_TUNNEL_TOKEN}
```

<br>

The code is pretty human-readable, but it essentially does the video conversion and the secure tunnel in one go.


## final setup

My other friends had worked on the website to display this stream, and everything was looking and working great. All we had left to do was to set up the camera and the old laptop server in their apartment. [Check out the code for everything else here](https://github.com/ivansamardzic/bar-camera-display), thanks Ivan. 

<br>

Funny thing is, we only tested at distances we thought would be realistic, but that changed when we arrived at the apartment. It worked great until nightfall. It turned out the streetlights around the bars were too bright, causing a massive glare that made it impossible to actually see the lines. We needed an optical zoom, but our camera only had a fixed lens. We were left with a finished product that didn't actually show anything useful. Back to the drawing board.


## conclusion

We decided to pack up and look for cameras with a mechanical zoom. It took us a couple weeks to find a good one, but during that time, our friend who owned the apartment became uncomfortable with having a camera there.

<br>

Without a location and with a camera we still hadn't tested, we decided to bin the project. Even though it didn't "launch," it was a massive learning experience. I would have loved to see how it handled the load of many people at once, but maybe I will get to experience that with the next project.
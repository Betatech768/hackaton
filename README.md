# EchoVision Documentation

## Overview

EchoVision is a spatial sound-planning platform that helps musicians, churches, and live venues understand how sound behaves in a room **before installation or performance**.

By combining Gemini-powered image analysis with 2D, 3D, and VR visualization, EchoVision turns real spaces into interactive sound models. This allows users to identify coverage gaps, poor speaker placement, and acoustic risks early — saving time, money, and frustration.

_EchoVision is designed for people who work with sound, not against them._

---

## Core Concept

Traditional sound planning relies heavily on experience, guesswork, or expensive site visits. EchoVision introduces a smarter workflow:

1. Upload images of the venue
2. Let Gemini analyze spatial and acoustic cues
3. Visualize the results in 2D, 3D, or VR
4. Make informed decisions before deployment

**The goal is simple: see sound before it fails.**

---

## How EchoVision Works

### 1. Image Input

Users upload images of the space, typically including:

- Stage view
- Left side
- Right side
- Back or ceiling view

_Each image is tagged with its role to give Gemini proper spatial context._

### 2. Gemini Spatial Analysis

Gemini processes the images using multimodal reasoning to infer:

- Hall dimensions and orientation
- Stage size and position
- Speaker placement and aiming angles
- Speaker roles (main, subwoofer, delay, fill)
- Acoustic risk areas (coverage gaps, reflections, obstruction zones)

Instead of returning a wall of text, Gemini produces **structured spatial data** — positions, angles, and roles — that behaves like a real system design model.

### 3. 2D Visualization

- Hall outline scaled to real dimensions
- Stage placement
- Speaker positions and orientations
- Coverage cones showing horizontal dispersion
- Color-coded speaker types for clarity

### 4. 3D Visualization

- Full hall geometry with walls, floor, and height
- Elevated speakers and stage platforms
- Accurate speaker aiming (horizontal & vertical angles)
- Interactive camera controls for inspection

### 5. VR Walkthrough

- Walk through the venue at human eye level
- View speaker coverage from the audience perspective
- Identify dead zones and overlap intuitively

---

## 🥽 How to Use VR Mode

### Meta Quest (Standalone)

1. Open the Meta Quest Browser inside your headset.
2. Navigate to Echovision site and upload your hall images.
3. Tap the 'Enter VR' button. Look for the browser prompt to 'Allow' immersive view.

### PCVR (Link / SteamVR)

1. Connect your headset to your PC and enable Quest Link or SteamVR.
2. Open Chrome, Edge or Firefox (recommended) on your desktop and go to the EchoVision site, upload your hall images.
3. Click 'Enter VR'. Put on your headset to begin the walkthrough.

### No Headset? (Emulator)

1. Install the WebXR API Emulator extension on Firefox from the Firefox Web Store. Chrome now uses the MetaQuest Emulator.
2. Open DevTools (F12) and find the WebXR tab.
3. Select a device and click 'Enter VR' to see the split-screen simulation on your monitor.

---

### 6. Recommendations & Cost Awareness

Gemini identifies potential issues such as:

- Poor coverage distribution, over-angled mains, or under-balcony dead zones.

For each issue, EchoVision provides suggested fixes, practical alternatives, and **estimated cost ranges** to ensure decisions are realistic.

---

## Key Features

- ✓ Gemini spatial reasoning
- ✓ 2D, 3D, and VR visualization
- ✓ Structured acoustic data
- ✓ Speaker coverage modeling
- ✓ Cost-aware recommendations
- ✓ User-friendly interface

---

## Design Philosophy

> **Clarity** – Visualize sound, don't guess
>
> **Empathy** – Built by someone who has mixed sound in real rooms
>
> **Practicality** – Every recommendation considers cost and feasibility

---

## Performance Considerations

EchoVision is optimized primarily for **desktop-class devices**. Due to the computational demands of real-time 3D rendering, spatial calculations, and WebXR support, performance is significantly better on PCs and laptops with stronger CPUs and GPUs.

On mobile devices, rendering performance may be reduced. Complex scenes—such as large venues with multiple speakers and coverage cones—can result in lower frame rates or limited interaction, especially on mid-range or older smartphones.

This behavior is expected given current mobile browser constraints around:

- WebGL performance
- Memory limits
- WebXR support
- Thermal throttling on mobile hardware

**For best results, EchoVision is recommended for use on desktop browsers when performing detailed analysis or immersive visualization.**

---

## Limitations & Future Improvements

EchoVision provides informed modeling, not a replacement for certified acoustic measurement tools.

Currently EchoVision has no way of detecting if the uploaded images are from the same venue. Inconsistent inputs may lead to inaccurate analysis. We plan to implement a verification step in the future to ensure all images belong to the same space.

Panaromic Images was a bit difficult to work with, so currently we only support 4 standard views. In the future, we plan to allow users to upload additional images from different angles for even more comprehensive analysis.

Gemini's spatial reasoning is powerful but not perfect. Complex venues with unusual layouts may require manual adjustments for optimal accuracy.

Gemini may return response that is not technically sound. Users should verify all outputs carefully.

EchoVision does not defend against intentionally misleading inputs. Users should avoid: Intentionally misleading photos, Cropped images hiding key context, Reused stock images, Screenshots of other venues

### Planned Improvements:

- Frequency-specific modeling, real-time SPL simulation / AR, and exportable technical reports.
- Remember past venues
- Reject outputs based on empirical error rates

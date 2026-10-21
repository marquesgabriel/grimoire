# Epitaph: writing-image-prompts

**Was:** `image-prompt-engineering`, in `imagecreator` (never committed
there). Retired on 2026-10-21.

**Why it was retired:** it was written for one script, `imagecreator`'s
`generate.py` (Stable Diffusion XL base + refiner), and that project stopped
at its initial commit in August 2026. Its advice is also specific to SDXL,
which ages fast: tag lists front-loaded by weight, native resolutions, CFG
ranges. Newer image models respond to natural-language descriptions and
have different parameters.

**What replaced it:** nothing yet.

**To bring it back:** move it to `incubator/` when there's an active image
generation project again, and rewrite it around the model actually in use.
The parts that last are the structure (subject, action, setting, lighting,
camera, style), asking for the orientation before generating, generating at
the native resolution and then upscaling, and iterating cheaply before the
final render.

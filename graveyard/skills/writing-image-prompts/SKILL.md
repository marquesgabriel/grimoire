---
name: writing-image-prompts
description: Use this skill when writing or improving prompts for the local SDXL image generator (generate.py) in this project. Covers prompt structure, style/camera/lighting vocabulary, negative prompts, and parameter tuning (steps, CFG, refiner fraction) to get higher quality output from Stable Diffusion XL.
---

# Prompt Engineering para SDXL (geração local)

Guia técnico para escrever prompts eficazes para o pipeline `generate.py` deste projeto (SDXL base + refiner, DPM++ 2M Karras).

## Estrutura de um bom prompt

Ordem recomendada, do mais importante para o menos importante (SDXL dá mais peso aos primeiros tokens):

1. **Sujeito principal** — o que/quem está na cena, com detalhes específicos (não genéricos).
2. **Ação/pose/expressão** — o que o sujeito está fazendo.
3. **Cenário/ambiente** — onde a cena acontece.
4. **Iluminação** — tipo e direção de luz.
5. **Composição/câmera** — enquadramento, lente, ângulo.
6. **Estilo/mídia** — fotografia, pintura, 3D render, anime, etc.
7. **Qualificadores técnicos** — resolução, nitidez, "RAW photo", etc.

Exemplo:
```
a woman reading a book on a park bench, autumn leaves falling,
golden hour backlighting, shallow depth of field, 85mm lens,
cinematic photography, RAW photo, highly detailed, 8k
```

## Vocabulário útil

**Iluminação**: `soft studio lighting`, `golden hour`, `rim lighting`, `dramatic side lighting`, `volumetric light`, `overcast diffused light`, `neon lighting`, `backlit`

**Câmera/lente**: `85mm lens`, `35mm lens`, `macro shot`, `wide angle`, `shallow depth of field`, `bokeh`, `low angle shot`, `close-up`, `full body shot`

**Estilo/mídia**: `RAW photo`, `cinematic still`, `editorial photography`, `oil painting`, `digital art`, `concept art`, `anime style`, `3d render, octane render`

**Qualidade** (usar com moderação, SDXL já é razoavelmente detalhado por padrão): `highly detailed`, `sharp focus`, `8k`, `award-winning photography`

**Anatomia/textura**: `detailed skin texture`, `natural skin pores`, `realistic fabric texture` — ajuda a evitar o look "plástico" comum em modelos base.

## Negative prompts

Usar sempre um negative prompt reduz artefatos. Base recomendada para retratos/pessoas:
```
blurry, low quality, deformed, extra fingers, missing fingers,
mutated hands, bad anatomy, watermark, text, signature, jpeg artifacts,
oversaturated, plastic skin
```
Ajuste conforme o problema que aparecer nas gerações (ex: se vier sempre com marca d'água, reforce `watermark` mais cedo no negative).

## Orientação da imagem

Antes de gerar (ou de salvar o comando final num arquivo de prompt), perguntar à pessoa qual orientação ela quer:

1. **Widescreen padrão** — `--width 1344 --height 768`
2. **Vertical para mídias sociais** (Stories/Reels/TikTok) — `--width 832 --height 1216`. Não é o 9:16 exato (0.68 vs 0.5625) porque fugir demais das resoluções nativas do SDXL distorce anatomia/composição; é o mais próximo de vertical que mantém qualidade.
3. **Ambas** — gerar duas imagens, uma para cada orientação acima (dois comandos/execuções separadas, não usar `--n` pra isso, já que `--n` repete a mesma resolução).

Não assumir a orientação por padrão — sempre confirmar antes de montar o comando final.

### Resolução final: 2K ou superior

Padrão do projeto é entregar em 2K+ (ex: 2560x1440 no caso widescreen). **Importante:** gerar direto nessa resolução no SDXL não funciona bem — acima de ~1.5x a resolução nativa o modelo tende a duplicar partes do corpo/composição (efeito "múltiplas cabeças"). O caminho correto é sempre em duas etapas:

1. Gerar na resolução nativa (as da tabela acima: `1344x768` ou `832x1216`).
2. Fazer upscale da imagem resultante até o alvo de 2K+ com um upscaler dedicado (ex: Real-ESRGAN), preservando nitidez sem reintroduzir distorção.

**Status atual:** `generate.py` ainda não tem essa etapa de upscale implementada — hoje ele só gera na resolução nativa. Se o alvo de 2K+ for prioridade, sinalizar para o usuário que é necessário adicionar suporte a upscale no script antes de entregar a imagem final nessa resolução, em vez de simplesmente subir `--width`/`--height` além dos valores nativos.

## Parâmetros do generate.py

| Parâmetro | Efeito | Recomendação |
|---|---|---|
| `--steps` | Quantidade de passos de denoising | 25-35. Acima disso o ganho é marginal. |
| `--guidance-scale` | Quão rígido o modelo segue o prompt (CFG) | 6-8. Muito alto (>10) gera artefatos e cores "queimadas". Muito baixo (<4) ignora o prompt. |
| `--refiner-frac` | Fração dos steps feita pelo modelo base antes do refiner assumir | 0.7-0.85. Menor = refiner atua mais (mais detalhe, mas pode mudar a composição). |
| `--no-refiner` | Desativa o refiner | Use para iterações rápidas de composição/seed antes de gastar tempo com a versão final refinada. |
| `--seed` | Fixa a semente | Fixe ao comparar mudanças de prompt/parâmetros isoladamente. |
| `--width`/`--height` | Resolução | Manter próximo dos nativos do SDXL: 1024x1024, 1216x832, 832x1216, 1344x768. Fugir muito disso distorce anatomia/composição. |

## Fluxo de iteração recomendado

1. Gerar com `--no-refiner --steps 20` e `--n 4` (ou seeds variadas) para explorar composição rápido e barato.
2. Escolher a seed que melhor captura a composição desejada.
3. Rodar de novo com essa seed, refiner ativado, steps 30, ajustando prompt/negative prompt para corrigir defeitos específicos observados.
4. Se anatomia (mãos/rosto) continuar ruim, é limitação do modelo base — considerar checkpoint fine-tuned (RealVisXL, Juggernaut-XL) em vez de insistir só no prompt.

## Nota sobre escopo de conteúdo

Este guia cobre técnica de prompt (estrutura, vocabulário, parâmetros) e vale para qualquer assunto dentro do que o assistente está disposto a gerar — incluindo conteúdo sensual/artístico não explícito. Pedidos de conteúdo sexual explícito continuam fora do escopo do que é gerado neste projeto, independente da técnica de prompt usada; isso não é algo que se contorna com melhor prompt engineering.

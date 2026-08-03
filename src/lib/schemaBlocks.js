// Shared helpers for blog structured-data schema blocks

export function createEmptySchemaBlock(type = 'Article') {
  return {
    id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    faqItems: [],
    howToSteps: [],
  };
}

export function normalizeSchemaBlocks(blog) {
  if (Array.isArray(blog?.schemaBlocks) && blog.schemaBlocks.length > 0) {
    return blog.schemaBlocks.map((block, index) => ({
      id: block.id || `block-${index}`,
      type: block.type || 'Article',
      faqItems: Array.isArray(block.faqItems) ? block.faqItems : [],
      howToSteps: Array.isArray(block.howToSteps) ? block.howToSteps : [],
    }));
  }

  const type = blog?.articleType || 'Article';
  return [
    {
      id: 'block-0',
      type,
      faqItems: Array.isArray(blog?.schemaFaqItems) ? blog.schemaFaqItems : [],
      howToSteps: Array.isArray(blog?.schemaHowToSteps) ? blog.schemaHowToSteps : [],
    },
  ];
}

export function serializeSchemaBlocks(schemaBlocks) {
  const blocks = Array.isArray(schemaBlocks) ? schemaBlocks : [];

  return blocks.map(({ type, faqItems, howToSteps }) => {
    const block = { type: type || 'Article' };
    if (block.type === 'FAQPage') {
      block.faqItems = Array.isArray(faqItems) ? faqItems : [];
    }
    if (block.type === 'HowTo') {
      block.howToSteps = Array.isArray(howToSteps) ? howToSteps : [];
    }
    return block;
  });
}

export function syncLegacySchemaFields(schemaBlocks) {
  const blocks = serializeSchemaBlocks(schemaBlocks);
  const first = blocks[0];
  const faqBlock = blocks.find((block) => block.type === 'FAQPage');
  const howToBlock = blocks.find((block) => block.type === 'HowTo');

  return {
    schemaBlocks: blocks,
    articleType: first?.type || 'Article',
    schemaFaqItems: faqBlock?.faqItems?.length ? faqBlock.faqItems : null,
    schemaHowToSteps: howToBlock?.howToSteps?.length ? howToBlock.howToSteps : null,
  };
}

export function resolveSchemaPayload(data = {}) {
  if (Array.isArray(data.schemaBlocks)) {
    return syncLegacySchemaFields(data.schemaBlocks);
  }

  return syncLegacySchemaFields(
    normalizeSchemaBlocks({
      articleType: data.articleType,
      schemaFaqItems: data.schemaFaqItems,
      schemaHowToSteps: data.schemaHowToSteps,
    })
  );
}

import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Decorates the news list block
 * @param {Element} block The news list block element
 */
export default function decorate(block) {
  // Process each news item
  [...block.children].forEach((item, index) => {
    // Add class to all items to make them use the featured layout
    item.classList.add('news-item-featured');
    
    // Check if the item has an image
    const imageContainer = item.querySelector(':scope > div:first-child');
    const hasImage = imageContainer && imageContainer.querySelector('picture');
    
    // Add a class to indicate whether the item has an image or not
    if (!hasImage) {
      item.classList.add('no-image');
      
      // If the first div is empty (no image), remove it
      if (imageContainer && !imageContainer.querySelector('picture')) {
        item.removeChild(imageContainer);
      }
    }
    
    // Create metadata container for 3rd and 4th columns
    createMetadataContainer(item);
    
    // Make image clickable if it exists
    if (hasImage) {
      makeImageClickable(item);
    }
    
    // Optimize images if needed
    const pictures = item.querySelectorAll('picture');
    pictures.forEach((picture) => {
      const img = picture.querySelector('img');
      if (img) {
        // We're keeping the existing picture structure as it already has responsive sources
        // But we could replace with optimized pictures if needed:
        // picture.replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]));
      }
    });
  });
  
  /**
   * Creates a metadata container for the 3rd and 4th columns
   * @param {Element} container The container element
   */
  function createMetadataContainer(container) {
    // For items without images, the column indices will be different
    // We need to find the columns that contain the category and date
    const isNoImage = container.classList.contains('no-image');
    
    // Get the appropriate columns based on whether there's an image or not
    let categoryColumn, dateColumn;
    
    if (isNoImage) {
      // For items without images, the category and date are in the 2nd and 3rd columns
      categoryColumn = container.querySelector(':scope > div:nth-child(2)');
      dateColumn = container.querySelector(':scope > div:nth-child(3)');
    } else {
      // For items with images, the category and date are in the 3rd and 4th columns
      categoryColumn = container.querySelector(':scope > div:nth-child(3)');
      dateColumn = container.querySelector(':scope > div:nth-child(4)');
    }
    
    if (categoryColumn && dateColumn) {
      // Create a metadata container
      const metadataContainer = document.createElement('div');
      metadataContainer.className = 'news-item-metadata';
      
      // Add classes to the columns
      categoryColumn.classList.add('news-item-category');
      dateColumn.classList.add('news-item-date');
      
      // Insert the metadata container before the category column
      container.insertBefore(metadataContainer, categoryColumn);
      
      // Move columns into the metadata container
      metadataContainer.appendChild(categoryColumn);
      
      // Add separator
      const separator = document.createElement('div');
      separator.className = 'metadata-separator';
      separator.innerHTML = '<p>|</p>';
      metadataContainer.appendChild(separator);
      
      // Add date column
      metadataContainer.appendChild(dateColumn);
      
      // Remove any empty text nodes
      metadataContainer.childNodes.forEach(node => {
        if (node.nodeType === 3 && !node.textContent.trim()) {
          metadataContainer.removeChild(node);
        }
      });
    }
  }
  
  /**
   * Makes the image clickable, linking to the same URL as the title
   * @param {Element} item The news item element
   */
  function makeImageClickable(item) {
    // Find the link in the button container
    const link = item.querySelector('.button-container a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    const title = link.getAttribute('title') || '';
    
    // Find the image container
    const imageContainer = item.querySelector('div:first-child');
    if (!imageContainer) return;
    
    // Make the image container clickable
    imageContainer.style.cursor = 'pointer';
    imageContainer.setAttribute('title', title);
    imageContainer.addEventListener('click', () => {
      window.location.href = href;
    });
  }
}
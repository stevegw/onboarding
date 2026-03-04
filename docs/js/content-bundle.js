/**
 * OB -- Content Bundle
 * =====================
 * All content embedded as JS for file:// compatibility.
 * Loaded before content.js. When present, content.js uses this
 * instead of fetch(). Regenerate by copying JSON file contents here.
 */
(function () {
  "use strict";
  var OB = window.OB = window.OB || {};

  OB._bundle = {
    "course.json": {
  "id": "wc-ocp1",
  "title": "Windchill: Options and Configurable Products 1",
  "description": "Learn business approaches to configurable products, explore options and variants terminology, investigate rules, and master option sets.",
  "prerequisite": "Windchill: BOM Restructuring",
  "modules": [
    {
      "id": "m1",
      "title": "Introduce Configurable Products",
      "description": "Examine business strategies for product variability, product platforms, product variants, and Windchill configuration approaches.",
      "estimatedMinutes": 20,
      "topicCount": 4,
      "contentFile": "modules/m1-configurable-products.json",
      "quizFile": "quizzes/q1-configurable-products.json"
    },
    {
      "id": "m2",
      "title": "Review Windchill Options and Variants",
      "description": "Examine options and variants terminology, discuss options and choices, explore preferences, and create configurable modules.",
      "estimatedMinutes": 25,
      "topicCount": 5,
      "contentFile": "modules/m2-options-and-variants.json",
      "quizFile": "quizzes/q2-options-and-variants.json",
      "comingSoon": true
    },
    {
      "id": "m3",
      "title": "Investigate Options and Variants Rules",
      "description": "Examine include, exclude, enable, and conditional rules. Explore rule validation and expression aliases.",
      "estimatedMinutes": 20,
      "topicCount": 4,
      "contentFile": "modules/m3-rules.json",
      "quizFile": "quizzes/q3-rules.json",
      "comingSoon": true
    },
    {
      "id": "m4",
      "title": "Explore Option Sets",
      "description": "Define option sets, explore change management, assign option sets, apply expressions, and use option filters.",
      "estimatedMinutes": 25,
      "topicCount": 5,
      "contentFile": "modules/m4-option-sets.json",
      "quizFile": "quizzes/q4-option-sets.json",
      "comingSoon": true
    }
  ]
},

    "modules/m1-configurable-products.json": {
  "id": "m1",
  "title": "Introduce Configurable Products",
  "description": "Examine business strategies for product variability, discuss considerations for product platforms and product variants, and examine product configuration approaches using Windchill.",
  "topics": [
    {
      "id": "m1t1",
      "title": "Business Strategies for Product Variability",
      "estimatedMinutes": 6,
      "content": [
        {
          "type": "paragraph",
          "text": "Manufacturing companies use different business strategies to deliver products with optional and customizable components. Understanding these strategies is the first step to configuring Windchill for your product variability needs."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Five Business Strategies"
        },
        {
          "type": "comparison-table",
          "headers": ["Strategy", "Description", "Example"],
          "rows": [
            ["Assemble-to-Order", "Design products with a finite list of discrete option choices for key features. Manufacturing executes without product development involvement.", "Passenger vehicles, heavy equipment, computers"],
            ["Assemble-to-Stock", "Design a general product with several discrete variations composed of minor changes in features.", "Consumer products in multiple colors and sizes (clothing, appliances)"],
            ["Configure-to-Order", "Design flexible products that can be configured or customized to fit unique customer needs using a configurator with rules.", "Industrial equipment, enterprise software with interdependent options"],
            ["Engineer-to-Order", "Like configure-to-order, but requires engineering team involvement for validation and custom design per order.", "Complex systems (turbines, aircraft components) requiring engineering review"],
            ["Contract", "Fully custom design and manufacture per customer specifications. Unique product per contract.", "One-off designs -- defense systems, custom infrastructure"]
          ]
        },
        {
          "type": "callout",
          "variant": "insight",
          "text": "The key differentiator between these strategies is the level of product development involvement per order. Assemble-to-order requires none, while contract requires full custom engineering for each customer."
        },
        {
          "type": "interactive-match",
          "prompt": "Match each scenario to the correct business strategy:",
          "pairs": [
            {"left": "A car manufacturer offers packages with predefined options like Sport, Luxury, and Base", "right": "Assemble-to-Order"},
            {"left": "A turbine company designs each product with engineering review for customer specs", "right": "Engineer-to-Order"},
            {"left": "A clothing brand produces shirts in 5 colors and 4 sizes", "right": "Assemble-to-Stock"},
            {"left": "A defense contractor builds a unique radar system for a military contract", "right": "Contract"}
          ]
        }
      ],
      "keyTakeaways": [
        "Five main business strategies exist, ranging from assemble-to-stock (least customization) to contract (fully custom)",
        "The strategy choice determines how much product development involvement is needed per order",
        "Windchill OCP primarily supports assemble-to-order and configure-to-order strategies"
      ]
    },
    {
      "id": "m1t2",
      "title": "Generic Platform Design",
      "estimatedMinutes": 5,
      "content": [
        {
          "type": "paragraph",
          "text": "Before creating product variants, companies first establish a generic product platform. This platform serves as the foundation from which all product variations are derived."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Four Steps of Platform Design"
        },
        {
          "type": "paragraph",
          "text": "The platform design phase follows a structured process to create a reusable product foundation:"
        },
        {
          "type": "reveal-cards",
          "cards": [
            {
              "front": "Step 1: Analyze Platform Optionality Requirements",
              "back": "Analyze the requirements of the new product and identify the options needed to satisfy those requirements. Determine what must be variable vs. fixed."
            },
            {
              "front": "Step 2: Assess Current Products for Reuse",
              "back": "Investigate existing variant designs for reuse and review new concepts. Leverage what already exists before creating new designs."
            },
            {
              "front": "Step 3: Create Generic Product Definition",
              "back": "Develop the framework to support product optionality. Reuse existing parts, options, and rules. Define new rules and logic for selecting product options. Evaluate and iterate as needed."
            },
            {
              "front": "Step 4: Release and Maintain Platform",
              "back": "Upon successful design and validation, release the generic platform to manufacturing planning or manufacturing. Manage and modify the platform as needed over time."
            }
          ]
        },
        {
          "type": "callout",
          "variant": "tip",
          "text": "A well-designed platform maximizes reuse across variants. The goal is to make the common parts truly common, and clearly identify the variable sections."
        }
      ],
      "keyTakeaways": [
        "Platform design is a prerequisite to variant generation",
        "Always assess existing products for reuse before creating new designs",
        "The platform framework defines which parts are fixed and which are variable"
      ]
    },
    {
      "id": "m1t3",
      "title": "Variant Generation",
      "estimatedMinutes": 5,
      "content": [
        {
          "type": "paragraph",
          "text": "Once a generic platform exists, specific product variants can be generated to meet market or customer requirements. The variant generation process builds on the platform to create configured products."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Variant Generation Steps"
        },
        {
          "type": "reveal-cards",
          "cards": [
            {
              "front": "Step 1: Analyze Specific Variant Requirements",
              "back": "Analyze market-specific or customer-specific needs. What does this particular customer or market segment need that differs from the base platform?"
            },
            {
              "front": "Step 2: Assess Current Platforms for Reuse",
              "back": "Evaluate existing generic platforms to select the one best suited for the requirements. Pick the platform that requires the least customization."
            },
            {
              "front": "Step 3: Create Variant Definition",
              "back": "Define the configuration for the variant and generate deliverables such as part structures and documentation. Modify the specific variant design as necessary."
            },
            {
              "front": "Step 4: Release and Maintain Variant",
              "back": "Once the variant is generated and approved, release it to manufacturing. Maintain and modify the variant definition as required."
            }
          ]
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Managing Configurable Products"
        },
        {
          "type": "paragraph",
          "text": "Companies adopt common industry practices to manage product information throughout the variant design and generation process:"
        },
        {
          "type": "comparison-table",
          "headers": ["Practice", "Description"],
          "rows": [
            ["Modular Product Structure", "Decompose the product into modular sections supporting specific functions. Modules may be shared across products."],
            ["Overloaded Product Structure", "Sections of the structure contain multiple designs to satisfy different capability levels for that function."],
            ["Option Management", "Define options and choices to identify variable features. Assign choices to designs in overloaded sections to control selection."],
            ["Order Structure", "A part structure with no additional options, reflecting a specific sales order. Analyzed, tested, and validated."]
          ]
        },
        {
          "type": "callout",
          "variant": "info",
          "text": "An overloaded structure is a key concept: it contains ALL possible design variations. During variant generation, the overloaded structure is filtered down to only the parts needed for a specific configuration."
        }
      ],
      "keyTakeaways": [
        "Variant generation follows four steps that mirror the platform design process",
        "Always evaluate existing platforms before building a new variant from scratch",
        "Overloaded product structures contain all possible variations; option filters reduce them to specific configurations"
      ]
    },
    {
      "id": "m1t4",
      "title": "Product Configuration in Windchill",
      "estimatedMinutes": 6,
      "content": [
        {
          "type": "paragraph",
          "text": "Windchill provides specific capabilities to support your business strategy for delivering configurable products. Understanding how business strategies map to Windchill features is essential for successful implementation."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Business Strategies Mapped to Windchill"
        },
        {
          "type": "comparison-table",
          "headers": ["Business Approach", "Windchill Capability", "How It Works"],
          "rows": [
            ["Assemble-to-Order / Assemble-to-Stock", "Options and Choices for filtering", "Options and choices filter an overloaded product structure. Orders typically created via external sales configurator (ATO) or in Windchill (ATS)."],
            ["Configure-to-Order / Engineer-to-Order", "List-based options + parameters", "List-based options filter the structure, while parameters provide advanced selection logic for additional configuration."]
          ]
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Windchill Capabilities for Product Variability"
        },
        {
          "type": "reveal-cards",
          "cards": [
            {
              "front": "Configurable Product Structure",
              "back": "Windchill parts can be defined as configurable, designating sections intended to have multiple designs. Supports modular and overloaded structures."
            },
            {
              "front": "Options for Filtering Selection Logic",
              "back": "Define a list of fixed options and choices describing discrete configurations. Reusable across products, with rules constraining valid combinations."
            },
            {
              "front": "Advanced Selection Logic (Parameters)",
              "back": "Parameters provide advanced selection logic using constraints to guide user input during configuration. Goes beyond simple option/choice lists."
            },
            {
              "front": "Combining Filtering and Advanced Selection",
              "back": "First filter an overloaded structure using list-based options, then further configure using parameters. Gives maximum flexibility."
            },
            {
              "front": "Variant Generation and Reuse",
              "back": "Create and update variants using filtering and selection logic. Windchill records option choices in a variant specification and searches for existing variants to enable reuse."
            }
          ]
        },
        {
          "type": "callout",
          "variant": "insight",
          "text": "The combining approach is the most powerful: use options to handle the broad filtering (\"Which engine?\"), then parameters for fine-grained configuration (\"What bore size?\"). This two-stage approach handles most real-world product variability."
        },
        {
          "type": "interactive-match",
          "prompt": "Match each Windchill capability to its primary purpose:",
          "pairs": [
            {"left": "Options and Choices", "right": "Filter overloaded structures using discrete selections"},
            {"left": "Parameters", "right": "Provide advanced selection logic with constraints"},
            {"left": "Variant Specification", "right": "Record the inputs used to generate a specific variant"},
            {"left": "Configurable Module", "right": "Designate product sections with multiple design variations"}
          ]
        }
      ],
      "keyTakeaways": [
        "Assemble-to-order/stock uses options and choices for filtering; configure/engineer-to-order adds parameters",
        "Options and parameters can be combined for maximum configurability",
        "Windchill tracks variant specifications to enable variant reuse across orders"
      ]
    }
  ]
},

    "quizzes/q1-configurable-products.json": {
  "moduleId": "m1",
  "title": "Configurable Products Knowledge Check",
  "questions": [
    {
      "id": "m1-kc-001",
      "question": "Which statement correctly reflects a configure-to-order business approach?",
      "options": [
        "A strategy to design products with a finite list of discrete option choices for key product features.",
        "A strategy to design flexible products, which can be configured or customized to fit the unique needs of each customer order.",
        "A strategy that involves fitting a general product to unique customer requirements with engineering involvement.",
        "A strategy to custom design and custom manufacture a product to fulfill the unique requirements of a specific customer."
      ],
      "answerIndex": 1,
      "rationale": "Configure-to-order is specifically about designing flexible products that can be configured or customized to fit unique customer needs, typically using a configurator with rules. Option A describes assemble-to-order, option C describes engineer-to-order, and option D describes contract product development.",
      "topic": "m1t1"
    },
    {
      "id": "m1-kc-002",
      "question": "What is the first step in the Generic Platform Design process?",
      "options": [
        "Create the generic product definition",
        "Assess current products for reuse",
        "Analyze platform optionality requirements",
        "Release and maintain the platform"
      ],
      "answerIndex": 2,
      "rationale": "The platform design process begins with analyzing requirements. You need to understand what options are required before assessing reuse opportunities or building anything.",
      "topic": "m1t2"
    },
    {
      "id": "m1-kc-003",
      "question": "What is an overloaded product structure?",
      "options": [
        "A product structure with too many parts to manage efficiently",
        "A structure where sections contain multiple designs to satisfy different capability levels",
        "A structure that has been exported and reimported multiple times",
        "A product structure that exceeds the maximum number of configurable modules"
      ],
      "answerIndex": 1,
      "rationale": "An overloaded product structure contains multiple designs within the same section to support a range of options. During variant generation, the structure is filtered down to the specific designs needed for a given configuration.",
      "topic": "m1t3"
    },
    {
      "id": "m1-kc-004",
      "question": "For assemble-to-order and assemble-to-stock strategies, what Windchill capability is primarily used?",
      "options": [
        "Parameters for advanced selection logic",
        "Workflow-based approval processes",
        "Options and choices for filtering an overloaded product structure",
        "CAD-driven product configuration"
      ],
      "answerIndex": 2,
      "rationale": "Assemble-to-order and assemble-to-stock strategies use options and choices to filter an overloaded product structure. Parameters are used additionally for configure-to-order and engineer-to-order strategies that need more advanced selection logic.",
      "topic": "m1t4"
    }
  ]
},

    "glossary.json": {
  "terms": [
    {"term": "Advanced Expression", "definition": "An expression that includes choices, operators, and functions. Can be assigned to parts and part usage links to specify conditions when a component should be included in the product structure."},
    {"term": "Basic Expression", "definition": "Option choices that you can assign to parts and part usage links to specify the conditions when a component should be included in the product structure."},
    {"term": "Configurable Module", "definition": "A Windchill part that may have one or more child parts representing variations in the design and configuration of a component or functional unit."},
    {"term": "Configurable Product", "definition": "A top-level end item that represents a collection of product variations. An example is a product family with different models sharing some standard components."},
    {"term": "Configurable Product Structure", "definition": "Includes configurable modules to support the ability to create multiple product variants from the same product structure."},
    {"term": "Conditional Rule", "definition": "A rule using IF/THEN statements to specify when certain option choices should be included, turned on, or turned off based on other choice selections in the option filter."},
    {"term": "Enable Rule", "definition": "A rule that makes only specific choices appear for selection once a certain target choice is selected."},
    {"term": "Exclude Rule", "definition": "A rule that restricts the selection of incompatible choices. For example, selecting 110 Volts prevents selecting 50 Hz frequency."},
    {"term": "Expression Alias", "definition": "A named logical statement that can be reused when authoring conditional rules, advanced expressions, and other aliases. Captures common definitions for global product management."},
    {"term": "Include Rule", "definition": "A rule that associates a selection of one option choice to one or more related option choices. Selecting the source choice automatically selects the target choices."},
    {"term": "Module Variant", "definition": "The specific parts selected from a configurable module's optional parts and components based on selection criteria and choice assignments during variant generation."},
    {"term": "Option", "definition": "A particular product feature. An option has one or more choices, can be required or single-selection, and is applicable to specific product variations."},
    {"term": "Option Filter", "definition": "A set of criteria used to filter the product structure based on choices assigned to parts and the usage of a part in a structure."},
    {"term": "Option Manager", "definition": "A Windchill context role with authority to create options and choices and maintain option sets and other related information."},
    {"term": "Option Pool", "definition": "A container that holds all available options and their choices for a product. Options and choices are managed within the option pool."},
    {"term": "Option Set", "definition": "A subset of options and choices from one or more option pools, used to define variations within a product family. Option sets are change-managed objects."},
    {"term": "Parameter", "definition": "An attribute defined locally within the context of a configurable module to support advanced selection logic during the part configuration process."},
    {"term": "Product Family", "definition": "A set of related products that offer a range of capabilities and share a substantial percentage of the same parts."},
    {"term": "Variant", "definition": "A part or part structure representing a specific configuration of a configurable product structure, created during a configure process."},
    {"term": "Variant Specification", "definition": "A record of user inputs of option choices and parameter values provided during a configure process, used to generate a variant part structure."},
    {"term": "Configurable Module Support", "definition": "A Windchill preference that controls the ability to create optional product structures. Must be set to Yes to use Options and Variants functionality."}
  ]
}
  };
})();

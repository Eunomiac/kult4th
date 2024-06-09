/**
 * @typedef {Object} DataFieldOptions
 * @property {boolean} [required=false]   Is this field required to be populated?
 * @property {boolean} [nullable=false]   Can this field have null values?
 * @property {Function|*} [initial]       The initial value of a field, or a function which assigns that initial value.
 * @property {Function} [validate]        A data validation function which accepts one argument with the current value.
 * @property {string} [label]             A localizable label displayed on forms which render this field.
 * @property {string} [hint]              Localizable help text displayed on forms which render this field.
 * @property {string} [validationError]   A custom validation error string. When displayed will be prepended with the
 *                                        document name, field name, and candidate value.
 */
/**
 * An abstract class that defines the base pattern for a data field within a data schema.
 * @abstract
 *
 * @property {string} name                The name of this data field within the schema that contains it
 *
 * @property {boolean} required=false     Is this field required to be populated?
 * @property {boolean} nullable=false     Can this field have null values?
 * @property {Function|*} initial         The initial value of a field, or a function which assigns that initial value.
 * @property {Function} validate          A data validation function which accepts one argument with the current value.
 * @property {boolean} [readonly=false]   Should the prepared value of the field be read-only, preventing it from being
 *                                        changed unless a change to the _source data is applied.
 * @property {string} label               A localizable label displayed on forms which render this field.
 * @property {string} hint                Localizable help text displayed on forms which render this field.
 * @property {string} validationError     A custom validation error string. When displayed will be prepended with the
 *                                        document name, field name, and candidate value.
 */

namespace foundry {
  namespace data {
    namespace fields {

      declare class DataField {
          /**
           * @param {DataFieldOptions} options    Options which configure the behavior of the field
           */
          constructor(options?: {});
          /**
           * The field name of this DataField instance.
           * This is assigned by SchemaField#initialize.
           * @internal
           */
          name: any;
          /**
           * A reference to the parent schema to which this DataField belongs.
           * This is assigned by SchemaField#initialize.
           * @internal
           */
          parent: any;
          /**
           * Default parameters for this field type
           * @return {DataFieldOptions}
           * @protected
           */
          static get _defaults(): {
              required: boolean;
              nullable: boolean;
              initial: undefined;
              readonly: boolean;
              label: string;
              hint: string;
              validationError: string;
          };
          /**
           * A dot-separated string representation of the field path within the parent schema.
           * @type {string}
           */
          get fieldPath(): any;
          /**
           * Apply a function to this DataField which propagates through recursively to any contained data schema.
           * @param {string|function} fn          The function to apply
           * @param {*} value                     The current value of this field
           * @param {object} [options={}]         Additional options passed to the applied function
           * @returns {object}                    The results object
           */
          apply(fn: any, value: any, options?: {}): any;
          /**
           * Coerce source data to ensure that it conforms to the correct data type for the field.
           * Data coercion operations should be simple and synchronous as these are applied whenever a DataModel is constructed.
           * For one-off cleaning of user-provided input the sanitize method should be used.
           * @param {*} value           The initial value
           * @param {object} [options]  Additional options for how the field is cleaned
           * @param {boolean} [options.partial]   Whether to perform partial cleaning?
           * @param {object} [options.source]     The root data model being cleaned
           * @returns {*}               The cast value
           */
          clean(value: any, options: any): any;
          /**
           * Apply any cleaning logic specific to this DataField type.
           * @param {*} value           The appropriately coerced value.
           * @param {object} [options]  Additional options for how the field is cleaned.
           * @returns {*}               The cleaned value.
           * @protected
           */
          _cleanType(value: any, options: any): any;
          /**
           * Cast a non-default value to ensure it is the correct type for the field
           * @param {*} value       The provided non-default value
           * @returns {*}           The standardized value
           * @protected
           */
          _cast(value: any): void;
          /**
           * Attempt to retrieve a valid initial value for the DataField.
           * @param {object} data   The source data object for which an initial value is required
           * @returns {*}           A valid initial value
           * @throws                An error if there is no valid initial value defined
           */
          getInitialValue(data: any): any;
          /**
           * Validate a candidate input for this field, ensuring it meets the field requirements.
           * A validation failure can be provided as a raised Error (with a string message) or by returning false.
           * A validator which returns true denotes that the result is certainly valid and further validations are unnecessary.
           * @param {*} value                        The initial value
           * @param {object} [options={}]            Options which affect validation behavior
           * @returns {ModelValidationError}         Returns a ModelValidationError if a validation failure occurred
           */
          validate(value: any, options?: {}): any;
          /**
           * Special validation rules which supersede regular field validation.
           * This validator screens for certain values which are otherwise incompatible with this field like null or undefined.
           * @param {*} value               The candidate value
           * @returns {boolean|void}        A boolean to indicate with certainty whether the value is valid.
           *                                Otherwise, return void.
           * @throws                        May throw a specific error if the value is not valid
           * @protected
           */
          _validateSpecial(value: any): true | undefined;
          /**
           * A default type-specific validator that can be overridden by child classes
           * @param {*} value               The candidate value
           * @param {object} [options={}]   Options which affect validation behavior
           * @returns {boolean|void}        A boolean to indicate with certainty whether the value is valid.
           *                                Otherwise, return void.
           * @throws                        May throw a specific error if the value is not valid
           * @protected
           */
          _validateType(value: any, options?: {}): void;
          /**
           * Initialize the original source data into a mutable copy for the DataModel instance.
           * @param {*} value                   The source value of the field
           * @param {Object} model              The DataModel instance that this field belongs to
           * @param {object} [options]          Initialization options
           * @returns {*}                       An initialized copy of the source data
           */
          initialize(value: any, model: any, options?: {}): any;
          /**
           * Export the current value of the field into a serializable object.
           * @param {*} value                   The initialized value of the field
           * @returns {*}                       An exported representation of the field
           */
          toObject(value: any): any;
      }
      /**
       * A special class of {@link DataField} which defines a data schema.
       */
      declare class SchemaField extends DataField {
          /**
           * @param {DataSchema} fields                 The contained field definitions
           * @param {DataFieldOptions} options          Options which configure the behavior of the field
           */
          constructor(fields: any, options?: {});
          /** @inheritdoc */
          static get _defaults(): any;
          /**
           * The contained field definitions.
           * @type {DataSchema}
           */
          fields: any;
          /**
           * Initialize and validate the structure of the provided field definitions.
           * @param {DataSchema} fields     The provided field definitions
           * @returns {DataSchema}          The validated schema
           * @protected
           */
          _initialize(fields: any): any;
          /**
           * Iterate over a SchemaField by iterating over its fields.
           * @type {Iterable<DataField>}
           */
          [Symbol.iterator](): Generator<unknown, void, unknown>;
          /**
           * An array of field names which are present in the schema.
           * @returns {string[]}
           */
          keys(): string[];
          /**
           * An array of DataField instances which are present in the schema.
           * @returns {DataField[]}
           */
          values(): unknown[];
          /**
           * An array of [name, DataField] tuples which define the schema.
           * @returns {Array<[string, DataField]>}
           */
          entries(): [string, unknown][];
          /**
           * Test whether a certain field name belongs to this schema definition.
           * @param {string} fieldName    The field name
           * @returns {boolean}           Does the named field exist in this schema?
           */
          has(fieldName: any): boolean;
          /**
           * Get a DataField instance from the schema by name
           * @param {string} fieldName    The field name
           * @returns {DataField}         The DataField instance or undefined
           */
          get(fieldName: any): any;
          /** @override */
          _cast(value: any): any;
          /** @inheritdoc */
          _cleanType(data: any, options?: {}): any;
          /** @override */
          initialize(value: any, model: any, options?: {}): any;
          /** @override */
          _validateType(data: any, options?: {}): void;
          /** @override */
          toObject(value: any): {};
          /** @override */
          apply(fn: any, data?: {}, options?: {}): {};
      }
      /**
       * A subclass of [DataField]{@link DataField} which deals with boolean-typed data.
       */
      declare class BooleanField extends DataField {
          /** @inheritdoc */
          static get _defaults(): any;
          /** @override */
          _cast(value: any): boolean;
          /** @override */
          _validateType(value: any): void;
      }
      /**
       * @typedef {DataFieldOptions} NumberFieldOptions
       * @property {number} [min]               A minimum allowed value
       * @property {number} [max]               A maximum allowed value
       * @property {number} [step]              A permitted step size
       * @property {boolean} [integer=false]    Must the number be an integer?
       * @property {number} [positive=false]    Must the number be positive?
       * @property {number[]|object|function} [choices]  An array of values or an object of values/labels which represent
       *                                        allowed choices for the field. A function may be provided which dynamically
       *                                        returns the array of choices.
       */
      /**
       * A subclass of [DataField]{@link DataField} which deals with number-typed data.
       *
       * @property {number} min                 A minimum allowed value
       * @property {number} max                 A maximum allowed value
       * @property {number} step                A permitted step size
       * @property {boolean} integer=false      Must the number be an integer?
       * @property {number} positive=false      Must the number be positive?
       * @property {number[]|object|function} [choices]  An array of values or an object of values/labels which represent
       *                                        allowed choices for the field. A function may be provided which dynamically
       *                                        returns the array of choices.
       */
      declare class NumberField extends DataField {
          #private;
          /**
           * @param {NumberFieldOptions} options  Options which configure the behavior of the field
           */
          constructor(options?: {});
          /** @inheritdoc */
          static get _defaults(): any;
          /** @override */
          _cast(value: any): number;
          /** @inheritdoc */
          _cleanType(value: any, options: any): any;
          /** @override */
          _validateType(value: any): void;
      }
      /**
       * @typedef {DataFieldOptions} StringFieldOptions
       * @property {boolean} [blank=true]       Is the string allowed to be blank (empty)?
       * @property {boolean} [trim=true]        Should any provided string be trimmed as part of cleaning?
       * @property {string[]|object|function} [choices]  An array of values or an object of values/labels which represent
       *                                        allowed choices for the field. A function may be provided which dynamically
       *                                        returns the array of choices.
       */
      /**
       * A subclass of [DataField]{@link DataField} which deals with string-typed data.
       *
       * @property {boolean} blank=true         Is the string allowed to be blank (empty)?
       * @property {boolean} trim=true          Should any provided string be trimmed as part of cleaning?
       * @property {string[]|object|function} [choices]  An array of values or an object of values/labels which represent
       *                                        allowed choices for the field. A function may be provided which dynamically
       *                                        returns the array of choices.
       */
      declare class StringField extends DataField {
          /**
           * @param {StringFieldOptions} options  Options which configure the behavior of the field
           */
          constructor(options?: {});
          /** @inheritdoc */
          static get _defaults(): any;
          /** @inheritdoc */
          clean(value: any, options: any): any;
          /** @override */
          _cast(value: any): string;
          /** @inheritdoc */
          _validateSpecial(value: any): true | undefined;
          /** @override */
          _validateType(value: any): true | undefined;
          /**
           * Test whether a provided value is a valid choice from the allowed choice set
           * @param {string} value      The provided value
           * @returns {boolean}         Is the choice valid?
           * @protected
           */
          _isValidChoice(value: any): boolean;
      }
      /**
       * A subclass of [DataField]{@link DataField} which deals with object-typed data.
       */
      declare class ObjectField extends DataField {
          /** @inheritdoc */
          static get _defaults(): any;
          /** @override */
          _cast(value: any): any;
          /** @override */
          initialize(value: any, model: any, options?: {}): any;
          /** @override */
          toObject(value: any): any;
          /** @override */
          _validateType(value: any, options?: {}): void;
      }
      /**
       * A subclass of [DataField]{@link DataField} which deals with array-typed data.
       */
      declare class ArrayField extends DataField {
          /**
           * @param {DataField} element         A DataField instance which defines the type of element contained in the Array.
           * @param {DataFieldOptions} options  Options which configure the behavior of the field
           */
          constructor(element: any, options?: {});
          /**
           * Validate the contained element type of the ArrayField
           * @param {*} element       The type of Array element
           * @returns {*}             The validated element type
           * @throws                  An error if the element is not a valid type
           * @protected
           */
          static _validateElementType(element: any): DataField;
          /** @inheritdoc */
          static get _defaults(): any;
          /** @override */
          _cast(value: any): any[];
          /** @override */
          _cleanType(value: any, options: any): any;
          /** @override */
          _validateType(value: any, options?: {}): void;
          /**
           * Validate every element of the ArrayField
           * @param {Array} value       The array to validate
           * @param {options} options   Validation options
           * @returns {Array}           An array of element-specific errors
           * @protected
           */
          _validateElements(value: any, options: any): any[];
          /** @override */
          initialize(value: any, model: any, options?: {}): any;
          /** @override */
          toObject(value: any): any;
          /** @override */
          apply(fn: any, value?: never[], options?: {}): any[];
      }
      /**
       * A subclass of [ArrayField]{@link ArrayField} which supports a set of contained elements.
       * Elements in this set are treated as fungible and may be represented in any order or discarded if invalid.
       */
      declare class SetField extends ArrayField {
          /** @override */
          _validateElements(value: any, options: any): any[];
          /** @override */
          initialize(value: any, model: any, options?: {}): Set<unknown>;
          /** @override */
          toObject(value: any): any[];
      }
      /**
       * A subclass of [ObjectField]{@link ObjectField} which embeds some other DataModel definition as an inner object.
       */
      declare class EmbeddedDataField extends SchemaField {
          /**
           * @param {typeof DataModel} model          The class of DataModel which should be embedded in this field
           * @param {DataFieldOptions} options        Options which configure the behavior of the field
           */
          constructor(model: any, options: any);
          /** @override */
          _initialize(schema: any): any;
          /** @override */
          initialize(value: any, model: any, options?: {}): any;
          /** @override */
          toObject(value: any): any;
      }
      /**
       * A subclass of [ArrayField]{@link ArrayField} which supports an embedded Document collection.
       * Invalid elements will be dropped from the collection during validation rather than failing for the field entirely.
       */
      declare class EmbeddedCollectionField extends ArrayField {
          /**
           * @param {typeof Document} element       The type of Document which belongs to this embedded collection
           * @param {DataFieldOptions} [options]    Options which configure the behavior of the field
           */
          constructor(element: any, options?: {});
          /** @override */
          static _validateElementType(element: any): any;
          /**
           * A reference to the DataModel subclass of the embedded document element
           * @type {typeof DataModel}
           */
          get model(): any;
          /**
           * The DataSchema of the contained Document model.
           * @type {SchemaField}
           */
          get schema(): any;
          /** @override */
          _cleanType(value: any, options: any): any;
          /**
           * @inheritdoc
           * @returns {Array<Object<Error>>}  An array of error objects
           */
          _validateElements(value: any, options: any): any[];
          /** @override */
          initialize(value: any, model: any, options?: {}): any;
          /** @override */
          toObject(value: any): any;
          /** @override */
          apply(fn: any, value?: never[], options?: {}): any[];
      }
      /**
       * A subclass of [StringField]{@link StringField} which provides the primary _id for a Document.
       * The field may be initially null, but it must be non-null when it is saved to the database.
       */
      declare class DocumentIdField extends StringField {
          /** @inheritdoc */
          static get _defaults(): any;
          /** @override */
          _cast(value: any): any;
          /** @override */
          _validateType(value: any): void;
      }
      /**
       * A special class of [StringField]{@link StringField} field which references another DataModel by its id.
       * This field may also be null to indicate that no foreign model is linked.
       */
      declare class ForeignDocumentField extends DocumentIdField {
          /**
           * @param {typeof Document} model           The foreign DataModel class definition which this field should link to.
           * @param {StringFieldOptions} options      Options which configure the behavior of the field
           */
          constructor(model: any, options?: {});
          /** @inheritdoc */
          static get _defaults(): any;
          /** @override */
          _cast(value: any): any;
          /** @inheritdoc */
          initialize(value: any, model: any, options?: {}): any;
          /** @inheritdoc */
          toObject(value: any): any;
      }
      /**
       * A subclass of [ObjectField]{@link ObjectField} which supports a system-level data object.
       */
      declare class SystemDataField extends ObjectField {
          /**
           * @param {typeof Document} document      The base document class which belongs in this field
           * @param {DataFieldOptions} options      Options which configure the behavior of the field
           */
          constructor(document: any, options?: {});
          /** @inheritdoc */
          static get _defaults(): any;
          /**
           * A convenience accessor for the name of the document type associated with this SystemDataField
           * @type {string}
           */
          get documentName(): any;
          /**
           * Get the DataModel definition that should be used for this type of document.
           * @param {string} type         The Document instance type
           * @returns {typeof DataModel|null}    The DataModel class, or null
           */
          getModelForType(type: any): any;
          /** @override */
          getInitialValue(data: any): any;
          /** @override */
          _cleanType(value: any, options: any): any;
          /** @override */
          initialize(value: any, model: any, options?: {}): any;
          /** @inheritdoc */
          _validateType(data: any, options?: {}): void;
          /** @override */
          toObject(value: any): any;
      }
      /**
       * A special [StringField]{@link StringField} which records a standardized CSS color string.
       */
      declare class ColorField extends StringField {
          /** @inheritdoc */
          static get _defaults(): any;
          /** @inheritDoc */
          clean(value: any, options: any): any;
          /** @inheritdoc */
          _validateType(value: any): void;
      }
      /**
       * @typedef {StringFieldOptions} FilePathFieldOptions
       * @property {string[]} [categories]    A set of categories in CONST.FILE_CATEGORIES which this field supports
       * @property {boolean} [base64=false]   Is embedded base64 data supported in lieu of a file path?
       * @property {boolean} [wildcard=false] Does this file path field allow wildcard characters?
       */
      /**
       * A special [StringField]{@link StringField} which records a file path or inline base64 data.
       * @property {string[]} categories      A set of categories in CONST.FILE_CATEGORIES which this field supports
       * @property {boolean} base64=false     Is embedded base64 data supported in lieu of a file path?
       * @property {boolean} wildcard=false   Does this file path field allow wildcard characters?
       */
      declare class FilePathField extends StringField {
          /**
           * @param {FilePathFieldOptions} options  Options which configure the behavior of the field
           */
          constructor(options?: {});
          /** @inheritdoc */
          static get _defaults(): any;
          /** @inheritdoc */
          _validateType(value: any): true | undefined;
      }
      /**
       * A special [NumberField]{@link NumberField} which represents an angle of rotation in degrees between 0 and 360.
       * @property {number} base                  Whether the base angle should be treated as 360 or as 0
       */
      declare class AngleField extends NumberField {
          /** @inheritdoc */
          static get _defaults(): any;
          /** @inheritdoc */
          _cast(value: any): any;
      }
      /**
       * A special [NumberField]{@link NumberField} represents a number between 0 and 1.
       */
      declare class AlphaField extends NumberField {
          static get _defaults(): any;
      }
      /**
       * A special [ObjectField]{@link ObjectField} which captures a mapping of User IDs to Document permission levels.
       */
      declare class DocumentOwnershipField extends ObjectField {
          /** @inheritdoc */
          static get _defaults(): any;
          /** @override */
          _validateType(value: any): false | undefined;
      }
      /**
       * A special [StringField]{@link StringField} which contains serialized JSON data.
       */
      declare class JSONField extends StringField {
          /** @inheritdoc */
          static get _defaults(): any;
          /** @override */
          clean(value: any, options: any): any;
          /** @override */
          _validateType(value: any): void;
          /** @override */
          initialize(value: any, model: any, options?: {}): any;
          /** @override */
          toObject(value: any): string;
      }
      /**
       * A subclass of [StringField]{@link StringField} which contains a sanitized HTML string.
       * This class does not override any StringField behaviors, but is used by the server-side to identify fields which
       * require sanitization of user input.
       */
      declare class HTMLField extends StringField {
          /** @inheritdoc */
          static get _defaults(): any;
      }
      /**
       * A subclass of {@link NumberField} which is used for storing integer sort keys.
       */
      declare class IntegerSortField extends NumberField {
          /** @inheritdoc */
          static get _defaults(): any;
      }
      /** @typedef {Object} DocumentStats
       * @property {string} systemId  The package name of the system the Document was created in.
       * @property {string} systemVersion  The version of the system the Document was created in.
       * @property {string} coreVersion  The core version the Document was created in.
       * @property {number} createdTime  A timestamp of when the Document was created.
       * @property {number} modifiedTime  A timestamp of when the Document was last modified.
       * @property {string} lastModifiedBy  The ID of the user who last modified the Document.
       */
      /**
       * A subclass of {@link SchemaField} which stores document metadata in the _stats field.
       * @mixes DocumentStats
       */
      declare class DocumentStatsField extends SchemaField {
          constructor(options: any);
      }
    }
  }
}

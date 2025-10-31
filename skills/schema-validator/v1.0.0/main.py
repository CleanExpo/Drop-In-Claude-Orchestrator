#!/usr/bin/env python3
"""
Schema Validator Skill

Validates data against JSON schemas.
"""

import json
import sys
from typing import Dict, Any, List


def validate_type(value: Any, expected_type: str) -> bool:
    """Validate a value's type."""
    type_map = {
        "string": str,
        "number": (int, float),
        "integer": int,
        "boolean": bool,
        "array": list,
        "object": dict,
        "null": type(None)
    }

    expected = type_map.get(expected_type)
    if expected is None:
        return False

    return isinstance(value, expected)


def validate_schema(data: Any, schema: Dict[str, Any], path: str = "$") -> List[Dict[str, str]]:
    """
    Validate data against a JSON schema (simplified implementation).

    Args:
        data: The data to validate
        schema: The JSON schema
        path: Current path in the data structure

    Returns:
        List of validation errors
    """
    errors = []

    # Type validation
    if "type" in schema:
        if not validate_type(data, schema["type"]):
            errors.append({
                "path": path,
                "message": f"Expected type '{schema['type']}' but got '{type(data).__name__}'"
            })
            return errors  # Stop validation if type is wrong

    # Object validation
    if schema.get("type") == "object" and isinstance(data, dict):
        properties = schema.get("properties", {})
        required = schema.get("required", [])

        # Check required fields
        for field in required:
            if field not in data:
                errors.append({
                    "path": f"{path}.{field}",
                    "message": f"Required field '{field}' is missing"
                })

        # Validate properties
        for key, value in data.items():
            if key in properties:
                field_errors = validate_schema(value, properties[key], f"{path}.{key}")
                errors.extend(field_errors)

    # Array validation
    if schema.get("type") == "array" and isinstance(data, list):
        items_schema = schema.get("items", {})
        for i, item in enumerate(data):
            item_errors = validate_schema(item, items_schema, f"{path}[{i}]")
            errors.extend(item_errors)

        # Min/max items
        if "minItems" in schema and len(data) < schema["minItems"]:
            errors.append({
                "path": path,
                "message": f"Array must have at least {schema['minItems']} items"
            })

        if "maxItems" in schema and len(data) > schema["maxItems"]:
            errors.append({
                "path": path,
                "message": f"Array must have at most {schema['maxItems']} items"
            })

    # String validation
    if schema.get("type") == "string" and isinstance(data, str):
        if "minLength" in schema and len(data) < schema["minLength"]:
            errors.append({
                "path": path,
                "message": f"String must be at least {schema['minLength']} characters"
            })

        if "maxLength" in schema and len(data) > schema["maxLength"]:
            errors.append({
                "path": path,
                "message": f"String must be at most {schema['maxLength']} characters"
            })

        if "pattern" in schema:
            import re
            if not re.match(schema["pattern"], data):
                errors.append({
                    "path": path,
                    "message": f"String does not match pattern '{schema['pattern']}'"
                })

    # Number validation
    if schema.get("type") in ("number", "integer") and isinstance(data, (int, float)):
        if "minimum" in schema and data < schema["minimum"]:
            errors.append({
                "path": path,
                "message": f"Number must be at least {schema['minimum']}"
            })

        if "maximum" in schema and data > schema["maximum"]:
            errors.append({
                "path": path,
                "message": f"Number must be at most {schema['maximum']}"
            })

    return errors


def execute(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main entry point for the schema validator skill.

    Args:
        input_data: {
            "data": {...},
            "schema": {...}
        }

    Returns:
        Validation result
    """
    data = input_data.get("data")
    schema = input_data.get("schema")

    if data is None:
        return {
            "status": "error",
            "message": "Missing 'data' field in input"
        }

    if schema is None:
        return {
            "status": "error",
            "message": "Missing 'schema' field in input"
        }

    errors = validate_schema(data, schema)

    return {
        "status": "success",
        "result": {
            "valid": len(errors) == 0,
            "errors": errors
        }
    }


if __name__ == "__main__":
    # Read input from stdin
    input_text = sys.stdin.read()
    input_data = json.loads(input_text)

    # Execute validation
    result = execute(input_data)

    # Output result as JSON
    print(json.dumps(result, indent=2))
